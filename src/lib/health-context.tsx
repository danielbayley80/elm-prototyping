import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Appointment, BookAppointmentParams } from '../types/appointment'
import {
  computeDurationMinutes,
  formatAppointmentType,
} from '../types/appointment'
import { mockAppointments } from '../mocks/appointments'
import type { GpCredentials } from '../mocks/nhs-login'
import {
  buildMockSourceCapabilities,
  mockConvenetPatientId,
} from '../mocks/nhs-login'
import { mockHealthShares, mockShareRecipients } from '../mocks/health-sharing'
import type { Prescription, OrderPrescriptionParams } from '../types/prescription'
import { mockPrescriptions, simulateGpStatusPoll } from '../mocks/prescriptions'
import type {
  ConnectedHealthSource,
  DisconnectMode,
  HealthConnection,
  SyncPreferences,
} from '../types/health-connection'
import { isConnected } from '../types/health-connection'
import type { HealthShare, PendingShare } from '../types/health-sharing'
import {
  defaultSharePermissions,
  formatShareGrantSummary,
  normalizeSharePermissions,
} from '../types/health-sharing'

interface HealthContextValue {
  connection: HealthConnection
  appointments: Appointment[]
  prescriptions: Prescription[]
  shares: HealthShare[]
  lpaHealthWelfareActive: boolean
  pendingShare: PendingShare | null
  toast: string | null
  connectSource: (sourceId: string, sourceName: string, region?: string) => void
  setGpCredentials: (credentials: GpCredentials) => void
  setPatientId: (patientId: string) => void
  giveConsent: () => void
  setSyncPreferences: (prefs: Partial<SyncPreferences>) => void
  completeConnection: (credentialsOverride?: GpCredentials) => void
  markSourcesSynced: () => void
  disconnectSource: (sourceId: string, mode: DisconnectMode) => void
  disconnectAll: () => void
  startShare: (
    recipientId: string,
    recipientName: string,
    recipientRelation: string,
    isAttorney?: boolean,
  ) => void
  startEditShare: (shareId: string) => void
  updatePendingShare: (update: Partial<PendingShare>) => void
  cancelPendingShare: () => void
  completeShare: () => void
  revokeShare: (shareId: string) => void
  showToast: (message: string) => void
  clearToast: () => void
  bookAppointment: (params: BookAppointmentParams) => void
  cancelAppointment: (id: string, cancellationReason: string) => void
  orderPrescription: (params: OrderPrescriptionParams) => void
  markPrescriptionCollected: (id: string, note?: string) => void
}

const STORAGE_KEY = 'elm-health-prototype'

const attorneyByRecipientId = Object.fromEntries(
  mockShareRecipients
    .filter((r) => r.isAttorney)
    .map((r) => [r.id, true]),
)

const mockShareById = Object.fromEntries(mockHealthShares.map((s) => [s.id, s]))

/** Fix legacy copy persisted in localStorage before wording was simplified to "LPA". */
function normalizeLpaWording(text: string): string {
  return text
    .replace(/\bregistered health & welfare LPA is in effect\b/gi, 'LPA is active')
    .replace(/\bregistered health & welfare LPA\b/gi, 'LPA')
    .replace(/\bhealth & welfare LPA\b/gi, 'LPA')
    .replace(/\bLPA health & welfare\b/gi, 'LPA')
    .replace(/\bhealth & welfare attorney\b/gi, 'attorney')
    .replace(/\bHealth & welfare attorney\b/g, 'Attorney')
    .replace(/Son · Health & welfare attorney/gi, 'Son')
    .replace(/Son · Attorney/gi, 'Son')
}

function migratePendingShare(pending: PendingShare | null): PendingShare | null {
  if (!pending) return null
  if ('permissions' in pending && pending.permissions) return pending
  return null
}

function migrateShares(shares: HealthShare[]): HealthShare[] {
  return shares.map((share) => {
    const mock = mockShareById[share.id]
    const migrated: HealthShare = {
      ...share,
      permissions: normalizeSharePermissions(share),
      recipientRelation: normalizeLpaWording(share.recipientRelation),
      termsSummary: normalizeLpaWording(share.termsSummary),
      accessLog: share.accessLog.map((event) => ({
        ...event,
        note: event.note ? normalizeLpaWording(event.note) : event.note,
      })),
    }

    if (mock) {
      migrated.termsSummary = mock.termsSummary
      migrated.recipientRelation = mock.recipientRelation
      migrated.isAttorney = mock.isAttorney
    } else if (attorneyByRecipientId[share.recipientId]) {
      migrated.isAttorney = true
    }

    return migrated
  })
}

const defaultInputRequirements = {
  appointmentBookingReason: 'required' as const,
  prescribingComment: 'optional' as const,
}

function migrateCapabilities(
  caps?: import('../types/source-capabilities').SourceCapabilities,
): import('../types/source-capabilities').SourceCapabilities | undefined {
  if (!caps) return caps
  return {
    ...caps,
    inputRequirements: caps.inputRequirements ?? defaultInputRequirements,
  }
}

function migrateAppointments(appointments: Appointment[]): Appointment[] {
  return appointments.map((a) => {
    const legacy = a as Appointment & { notes?: string }
    const startTime = a.startTime ?? a.dateTime
    const endTime =
      a.endTime ??
      new Date(
        new Date(startTime).getTime() + (a.duration ?? 15) * 60_000,
      ).toISOString()
    const slotTypeName = a.slotTypeName ?? a.type
    return {
      ...a,
      slotTypeName,
      sessionType: a.sessionType,
      startTime,
      endTime,
      dateTime: startTime,
      duration: a.duration ?? computeDurationMinutes(startTime, endTime),
      type: a.type ?? formatAppointmentType(slotTypeName, a.sessionType),
      bookingReason: a.bookingReason ?? legacy.notes,
    }
  })
}

function migratePrescriptions(prescriptions: Prescription[]): Prescription[] {
  return prescriptions.map((p) => {
    const legacy = p as Prescription & {
      lastOrdered?: string
      status?: string
    }
    const migrated: Prescription = {
      ...p,
      lastIssued: p.lastIssued ?? legacy.lastOrdered ?? p.lastIssued,
    }
    if (!migrated.gpOrderStatus && legacy.status) {
      if (legacy.status === 'ordered') migrated.gpOrderStatus = 'requested'
      if (legacy.status === 'ready') migrated.gpOrderStatus = 'approved'
      if (legacy.status === 'collected') {
        migrated.gpOrderStatus = 'approved'
        migrated.manualCollectedAt =
          migrated.manualCollectedAt ?? new Date().toISOString()
      }
    }
    return migrated
  })
}

function migrateConnectedSources(sources: ConnectedHealthSource[]): ConnectedHealthSource[] {
  return sources.map((s) => ({
    ...s,
    capabilities: migrateCapabilities(s.capabilities),
  }))
}

const defaultSyncPreferences: SyncPreferences = {
  appointmentsToCalendar: false,
  prescriptionsToCalendar: false,
  notificationsEnabled: true,
}

const defaultConnection: HealthConnection = {
  connectedSources: [],
  syncPreferences: defaultSyncPreferences,
  pending: null,
}

function migrateLegacyConnection(parsed: Record<string, unknown>): HealthConnection {
  const legacy = parsed.connection as Record<string, unknown> | undefined
  if (!legacy) return defaultConnection

  if (Array.isArray(legacy.connectedSources)) {
    return {
      connectedSources: migrateConnectedSources(
        legacy.connectedSources as ConnectedHealthSource[],
      ),
      syncPreferences: (legacy.syncPreferences as SyncPreferences) ?? defaultSyncPreferences,
      pending: (legacy.pending as HealthConnection['pending']) ?? null,
    }
  }

  if (legacy.connected && legacy.sourceId) {
    const source: ConnectedHealthSource = {
      id: legacy.sourceId as string,
      name: (legacy.sourceName as string) ?? 'Health source',
      region: 'England',
      connectedAt: (legacy.connectedAt as string) ?? new Date().toISOString(),
      lastSyncedAt: (legacy.connectedAt as string) ?? new Date().toISOString(),
      syncStatus: 'up-to-date',
      practiceName: (legacy.gpCredentials as GpCredentials | null)?.practiceName,
    }
    return {
      connectedSources: [source],
      syncPreferences: (legacy.syncPreferences as SyncPreferences) ?? defaultSyncPreferences,
      pending: null,
    }
  }

  return {
    connectedSources: [],
    syncPreferences: (legacy.syncPreferences as SyncPreferences) ?? defaultSyncPreferences,
    pending: null,
  }
}

function loadState(): {
  connection: HealthConnection
  appointments: Appointment[]
  prescriptions: Prescription[]
  shares: HealthShare[]
  lpaHealthWelfareActive: boolean
  pendingShare: PendingShare | null
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const connection = migrateLegacyConnection(parsed)
      return {
        connection: {
          ...connection,
          connectedSources: migrateConnectedSources(connection.connectedSources),
        },
        appointments: migrateAppointments(parsed.appointments ?? mockAppointments),
        prescriptions: migratePrescriptions(parsed.prescriptions ?? mockPrescriptions),
        shares: migrateShares(parsed.shares ?? mockHealthShares),
        lpaHealthWelfareActive: parsed.lpaHealthWelfareActive ?? true,
        pendingShare: migratePendingShare(parsed.pendingShare as PendingShare | null),
      }
    }
  } catch {
    // ignore
  }
  return {
    connection: defaultConnection,
    appointments: mockAppointments,
    prescriptions: mockPrescriptions,
    shares: migrateShares(mockHealthShares),
    lpaHealthWelfareActive: true,
    pendingShare: null,
  }
}

function saveState(
  connection: HealthConnection,
  appointments: Appointment[],
  prescriptions: Prescription[],
  shares: HealthShare[],
  lpaHealthWelfareActive: boolean,
  pendingShare: PendingShare | null,
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      connection,
      appointments,
      prescriptions,
      shares,
      lpaHealthWelfareActive,
      pendingShare,
    }),
  )
}

const HealthContext = createContext<HealthContextValue | null>(null)

export function HealthProvider({ children }: { children: ReactNode }) {
  const initial = loadState()
  const [connection, setConnection] = useState<HealthConnection>(initial.connection)
  const [appointments, setAppointments] = useState<Appointment[]>(initial.appointments)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initial.prescriptions)
  const [shares, setShares] = useState<HealthShare[]>(initial.shares)
  const [lpaHealthWelfareActive] = useState(initial.lpaHealthWelfareActive)
  const [pendingShare, setPendingShare] = useState<PendingShare | null>(initial.pendingShare)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    saveState(
      connection,
      appointments,
      prescriptions,
      shares,
      lpaHealthWelfareActive,
      pendingShare,
    )
  }, [connection, appointments, prescriptions, shares, lpaHealthWelfareActive, pendingShare])

  useEffect(() => {
    if (connection.connectedSources.length === 0) return

    const stale = connection.connectedSources.some((s) => {
      const age = Date.now() - new Date(s.lastSyncedAt).getTime()
      return age > 24 * 60 * 60 * 1000
    })
    if (!stale && connection.connectedSources.every((s) => s.syncStatus !== 'syncing')) {
      return
    }

    setConnection((prev) => ({
      ...prev,
      connectedSources: prev.connectedSources.map((s) => ({
        ...s,
        syncStatus: 'syncing' as const,
      })),
    }))

    const timer = setTimeout(() => {
      setConnection((prev) => ({
        ...prev,
        connectedSources: prev.connectedSources.map((s) => ({
          ...s,
          syncStatus: 'up-to-date' as const,
          lastSyncedAt: new Date().toISOString(),
        })),
      }))
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const showToast = useCallback((message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
  }, [])

  const clearToast = useCallback(() => setToast(null), [])

  const connectSource = useCallback(
    (sourceId: string, sourceName: string, region = 'England') => {
      setConnection((prev) => ({
        ...prev,
        pending: {
          sourceId,
          sourceName,
          region,
          gpCredentials: null,
          patientId: null,
          consentGiven: false,
        },
      }))
    },
    [],
  )

  const setGpCredentials = useCallback((credentials: GpCredentials) => {
    setConnection((prev) =>
      prev.pending
        ? { ...prev, pending: { ...prev.pending, gpCredentials: credentials } }
        : prev,
    )
  }, [])

  const setPatientId = useCallback((patientId: string) => {
    setConnection((prev) =>
      prev.pending ? { ...prev, pending: { ...prev.pending, patientId } } : prev,
    )
  }, [])

  const giveConsent = useCallback(() => {
    setConnection((prev) =>
      prev.pending
        ? { ...prev, pending: { ...prev.pending, consentGiven: true } }
        : prev,
    )
  }, [])

  const setSyncPreferences = useCallback((prefs: Partial<SyncPreferences>) => {
    setConnection((prev) => ({
      ...prev,
      syncPreferences: { ...prev.syncPreferences, ...prefs },
    }))
  }, [])

  const completeConnection = useCallback((credentialsOverride?: GpCredentials) => {
    setConnection((prev) => {
      if (!prev.pending) return prev

      const credentials = credentialsOverride ?? prev.pending.gpCredentials
      const now = new Date().toISOString()
      const newSource: ConnectedHealthSource = {
        id: prev.pending.sourceId,
        name: prev.pending.sourceName,
        region: prev.pending.region,
        connectedAt: now,
        lastSyncedAt: now,
        syncStatus: 'syncing',
        practiceName: credentials?.practiceName,
        patientId: mockConvenetPatientId,
        capabilities: buildMockSourceCapabilities(),
      }

      const alreadyConnected = prev.connectedSources.some((s) => s.id === newSource.id)
      const connectedSources = alreadyConnected
        ? prev.connectedSources.map((s) => (s.id === newSource.id ? newSource : s))
        : [...prev.connectedSources, newSource]

      return {
        ...prev,
        connectedSources,
        pending: null,
      }
    })
  }, [])

  const markSourcesSynced = useCallback(() => {
    setConnection((prev) => ({
      ...prev,
      connectedSources: prev.connectedSources.map((s) => ({
        ...s,
        syncStatus: 'up-to-date' as const,
        lastSyncedAt: new Date().toISOString(),
      })),
    }))
  }, [])

  const disconnectSource = useCallback(
    (sourceId: string, mode: DisconnectMode) => {
      setConnection((prev) => {
        const connectedSources = prev.connectedSources.filter((s) => s.id !== sourceId)
        if (mode === 'remove-data' && connectedSources.length === 0) {
          setAppointments(mockAppointments)
          setPrescriptions(mockPrescriptions)
        }
        return { ...prev, connectedSources }
      })

      showToast(
        mode === 'keep-data'
          ? 'Disconnected — your data has been kept'
          : 'Disconnected — data from this source has been removed',
      )
    },
    [showToast],
  )

  const disconnectAll = useCallback(() => {
    setConnection(defaultConnection)
    setAppointments(mockAppointments)
    setPrescriptions(mockPrescriptions)
    showToast('All health sources disconnected')
  }, [showToast])

  const startShare = useCallback(
    (
      recipientId: string,
      recipientName: string,
      recipientRelation: string,
      isAttorney = false,
    ) => {
      setPendingShare({
        recipientId,
        recipientName,
        recipientRelation,
        isAttorney,
        permissions: defaultSharePermissions(),
        lpaExpandedSections: [],
        activation: isAttorney ? 'lpa_gated' : 'always',
      })
    },
    [],
  )

  const startEditShare = useCallback(
    (shareId: string) => {
      const share = shares.find((s) => s.id === shareId)
      if (!share || share.status === 'revoked') return

      setPendingShare({
        recipientId: share.recipientId,
        recipientName: share.recipientName,
        recipientRelation: share.recipientRelation,
        isAttorney: share.isAttorney,
        permissions: {
          ...share.permissions,
          recordSections: { ...share.permissions.recordSections },
        },
        lpaExpandedSections: share.lpaExpandedSections ?? [],
        activation: share.activation,
        editingShareId: share.id,
      })
    },
    [shares],
  )

  const updatePendingShare = useCallback((update: Partial<PendingShare>) => {
    setPendingShare((prev) => (prev ? { ...prev, ...update } : prev))
  }, [])

  const cancelPendingShare = useCallback(() => {
    setPendingShare(null)
  }, [])

  const buildTermsSummary = (pending: PendingShare): string => {
    return formatShareGrantSummary(
      pending.permissions,
      pending.activation,
      pending.recipientName,
    )
  }

  const completeShare = useCallback(() => {
    if (!pendingShare) return

    const now = new Date().toISOString()
    const termsSummary = buildTermsSummary(pendingShare)

    if (pendingShare.editingShareId) {
      setShares((prev) =>
        prev.map((s) =>
          s.id === pendingShare.editingShareId
            ? {
                ...s,
                permissions: pendingShare.permissions,
                activation: pendingShare.activation,
                lpaExpandedSections:
                  pendingShare.activation === 'lpa_expanded'
                    ? pendingShare.lpaExpandedSections
                    : undefined,
                status:
                  pendingShare.activation === 'lpa_gated' && !lpaHealthWelfareActive
                    ? ('pending_lpa' as const)
                    : s.status === 'revoked'
                      ? s.status
                      : ('active' as const),
                termsSummary,
              }
            : s,
        ),
      )
      setPendingShare(null)
      showToast(`Access updated for ${pendingShare.recipientName}`)
      return
    }

    const newShare: HealthShare = {
      id: `share-${Date.now()}`,
      recipientId: pendingShare.recipientId,
      recipientName: pendingShare.recipientName,
      recipientRelation: pendingShare.recipientRelation,
      isAttorney: pendingShare.isAttorney,
      permissions: pendingShare.permissions,
      lpaExpandedSections:
        pendingShare.activation === 'lpa_expanded'
          ? pendingShare.lpaExpandedSections
          : undefined,
      activation: pendingShare.activation,
      status:
        pendingShare.activation === 'lpa_gated' && !lpaHealthWelfareActive
          ? 'pending_lpa'
          : 'active',
      createdAt: now,
      consentRecordedAt: now,
      termsSummary,
      accessLog: [],
    }

    setShares((prev) => [...prev, newShare])
    setPendingShare(null)
    showToast(`Sharing set up for ${pendingShare.recipientName}`)
  }, [pendingShare, lpaHealthWelfareActive, showToast])

  const revokeShare = useCallback(
    (shareId: string) => {
      const now = new Date().toISOString()
      setShares((prev) =>
        prev.map((s) =>
          s.id === shareId ? { ...s, status: 'revoked' as const, revokedAt: now } : s,
        ),
      )
      showToast('Sharing access revoked — record kept for audit')
    },
    [showToast],
  )

  const bookAppointment = useCallback(
    (params: BookAppointmentParams) => {
      const { slot, bookingReason } = params
      const newAppt: Appointment = {
        id: `apt-${Date.now()}`,
        appointmentId: `cnv-apt-${Date.now()}`,
        slotTypeName: slot.slotTypeName,
        sessionType: slot.sessionType,
        type: formatAppointmentType(slot.slotTypeName, slot.sessionType),
        clinician: slot.clinicianDisplayName,
        location: slot.locationName,
        locationAddress: slot.locationAddress,
        startTime: slot.startTime,
        endTime: slot.endTime,
        dateTime: slot.startTime,
        duration: computeDurationMinutes(slot.startTime, slot.endTime),
        status: 'booked',
        canBeCancelled: true,
        bookingDate: new Date().toISOString(),
        bookingReason,
      }
      setAppointments((prev) => [...prev, newAppt])
      if (connection.syncPreferences.appointmentsToCalendar) {
        showToast('Appointment booked and added to your ELM calendar')
      } else {
        showToast('Appointment booked successfully')
      }
    },
    [connection.syncPreferences.appointmentsToCalendar, showToast],
  )

  const cancelAppointment = useCallback(
    (id: string, cancellationReason: string) => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'cancelled' as const,
                canBeCancelled: false,
                cancellationReason,
              }
            : a,
        ),
      )
      showToast('Appointment cancelled')
    },
    [showToast],
  )

  const orderPrescription = useCallback(
    (params: OrderPrescriptionParams) => {
      const now = new Date().toISOString()
      const orderId = `cnv-rx-ord-${Date.now()}`

      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === params.prescriptionId
            ? {
                ...p,
                gpOrderStatus: 'requested' as const,
                prescriptionOrderId: orderId,
                orderRequestDate: now,
                orderPharmacyName: params.pharmacyName,
                orderPharmacyOds: params.pharmacyOds,
                orderComment: params.comment,
                lastIssued: now,
              }
            : p,
        ),
      )

      simulateGpStatusPoll((id, status) => {
        setPrescriptions((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, gpOrderStatus: status } : p,
          ),
        )
        showToast('Your GP has approved your repeat prescription request')
      }, params.prescriptionId)

      if (connection.syncPreferences.prescriptionsToCalendar) {
        showToast('Repeat prescription ordered — due date added to your ELM calendar')
      } else {
        showToast('Repeat prescription ordered — awaiting GP approval')
      }
    },
    [connection.syncPreferences.prescriptionsToCalendar, showToast],
  )

  const markPrescriptionCollected = useCallback(
    (id: string, note?: string) => {
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                manualCollectedAt: new Date().toISOString(),
                manualCollectedNote: note,
              }
            : p,
        ),
      )
      showToast('Prescription marked as collected')
    },
    [showToast],
  )

  const value = useMemo(
    () => ({
      connection,
      appointments,
      prescriptions,
      shares,
      lpaHealthWelfareActive,
      pendingShare,
      toast,
      connectSource,
      setGpCredentials,
      setPatientId,
      giveConsent,
      setSyncPreferences,
      completeConnection,
      markSourcesSynced,
      disconnectSource,
      disconnectAll,
      startShare,
      startEditShare,
      updatePendingShare,
      cancelPendingShare,
      completeShare,
      revokeShare,
      showToast,
      clearToast,
      bookAppointment,
      cancelAppointment,
      orderPrescription,
      markPrescriptionCollected,
    }),
    [
      connection,
      appointments,
      prescriptions,
      shares,
      lpaHealthWelfareActive,
      pendingShare,
      toast,
      connectSource,
      setGpCredentials,
      setPatientId,
      giveConsent,
      setSyncPreferences,
      completeConnection,
      markSourcesSynced,
      disconnectSource,
      disconnectAll,
      startShare,
      startEditShare,
      updatePendingShare,
      cancelPendingShare,
      completeShare,
      revokeShare,
      showToast,
      clearToast,
      bookAppointment,
      cancelAppointment,
      orderPrescription,
      markPrescriptionCollected,
    ],
  )

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
}

export function useHealth() {
  const ctx = useContext(HealthContext)
  if (!ctx) throw new Error('useHealth must be used within HealthProvider')
  return ctx
}

export { isConnected }
