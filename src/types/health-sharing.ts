/** @deprecated legacy section keys — use SharePermissionSet */
export type ShareSection =
  | 'medical_records'
  | 'appointments'
  | 'prescriptions'
  | 'medications'
  | 'conditions'

export type ShareScope = 'full' | 'partial'

export type ShareActivation =
  | 'always'
  | 'lpa_gated'
  | 'lpa_expanded'

export type ShareStatus = 'active' | 'revoked' | 'pending_lpa'

/** Top-level feature access for appointments & prescriptions */
export type FeatureAccess = 'none' | 'view' | 'manage'

/** Per-section medical record visibility */
export type RecordVisibility = 'none' | 'active' | 'all'

export type RecordSectionKey =
  | 'medications'
  | 'conditions'
  | 'allergies'
  | 'problems'
  | 'testResults'
  | 'consultations'
  | 'immunisations'
  | 'documents'

export interface SharePermissionSet {
  appointments: FeatureAccess
  prescriptions: FeatureAccess
  recordSections: Record<RecordSectionKey, RecordVisibility>
}

export interface ShareAccessEvent {
  id: string
  accessedAt: string
  section?: ShareSection
  note?: string
}

export interface HealthShare {
  id: string
  recipientId: string
  recipientName: string
  recipientRelation: string
  isAttorney?: boolean
  permissions: SharePermissionSet
  /** @deprecated derived from permissions for older displays */
  scope?: ShareScope
  sections?: ShareSection[]
  lpaExpandedSections?: ShareSection[]
  activation: ShareActivation
  status: ShareStatus
  createdAt: string
  consentRecordedAt: string
  revokedAt?: string
  lastAccessedAt?: string
  termsSummary: string
  accessLog: ShareAccessEvent[]
}

export interface ShareRecipient {
  id: string
  name: string
  relation: string
  isAttorney?: boolean
  hasExistingShare?: boolean
}

export interface PendingShare {
  recipientId: string
  recipientName: string
  recipientRelation: string
  isAttorney?: boolean
  permissions: SharePermissionSet
  lpaExpandedSections: ShareSection[]
  activation: ShareActivation
  /** When set, completeShare updates this grant instead of creating a new one */
  editingShareId?: string
}

export function isEditingPendingShare(pending: PendingShare): boolean {
  return pending.editingShareId != null
}

export const featureAccessLabels: Record<FeatureAccess, string> = {
  none: 'None',
  view: 'View',
  manage: 'Manage',
}

export const recordVisibilityLabels: Record<RecordVisibility, string> = {
  none: 'None',
  active: 'Current',
  all: 'All',
}

export const shareActivationLabels: Record<ShareActivation, string> = {
  always: 'Always active',
  lpa_gated: 'Only when your LPA is active',
  lpa_expanded: 'Varies with LPA',
}

export const recordSectionLabels: Record<RecordSectionKey, string> = {
  medications: 'Medications',
  conditions: 'Conditions',
  allergies: 'Allergies',
  problems: 'Problems',
  testResults: 'Test results',
  consultations: 'Consultations',
  immunisations: 'Immunisations',
  documents: 'Documents',
}

export const shareSectionLabels: Record<ShareSection, string> = {
  medical_records: 'Medical records',
  appointments: 'Appointments',
  prescriptions: 'Repeat prescriptions',
  medications: 'Medications',
  conditions: 'Conditions & allergies',
}

export function defaultSharePermissions(): SharePermissionSet {
  return {
    appointments: 'none',
    prescriptions: 'none',
    recordSections: {
      medications: 'none',
      conditions: 'none',
      allergies: 'none',
      problems: 'none',
      testResults: 'none',
      consultations: 'none',
      immunisations: 'none',
      documents: 'none',
    },
  }
}

const recordKeys = Object.keys(recordSectionLabels) as RecordSectionKey[]

export function hasAnySharePermission(permissions: SharePermissionSet): boolean {
  if (permissions.appointments !== 'none' || permissions.prescriptions !== 'none') {
    return true
  }
  return recordKeys.some((k) => permissions.recordSections[k] !== 'none')
}

export type ShareAccessLevel = 'none' | 'read_only' | 'limited' | 'full'

/** Visual tier for access indicators (limited → more → full) */
export type AccessTier = 'none' | 'limited' | 'more' | 'full'

export function shareActivationSummary(activation: ShareActivation): string {
  switch (activation) {
    case 'always':
      return 'Access applies immediately once accepted'
    case 'lpa_gated':
      return 'Access only when your LPA is active'
    case 'lpa_expanded':
      return 'Varies with LPA'
  }
}

export function classifyActivationTier(activation: ShareActivation): AccessTier {
  switch (activation) {
    case 'always':
      return 'full'
    case 'lpa_gated':
      return 'limited'
    case 'lpa_expanded':
      return 'more'
  }
}

export function shareActivationDetail(
  activation: ShareActivation,
): { label: string; value: string }[] {
  switch (activation) {
    case 'always':
      return [{ label: 'When access applies', value: 'On acceptance' }]
    case 'lpa_gated':
      return [{ label: 'When access applies', value: 'When LPA is active' }]
    case 'lpa_expanded':
      return [{ label: 'When access applies', value: 'Varies with LPA status' }]
  }
}

export interface ShareAccessSummaryParts {
  appointmentsPrescriptions: string
  record: string
  appointmentsPrescriptionsDetail: { label: string; value: string }[]
  recordDetail: { label: string; value: string }[]
  appointmentsPrescriptionsTier: AccessTier
  recordTier: AccessTier
  level: ShareAccessLevel
}

export function classifyAppointmentsPrescriptionsTier(
  permissions: SharePermissionSet,
): AccessTier {
  const { appointments, prescriptions } = permissions
  if (appointments === 'none' && prescriptions === 'none') return 'none'
  if (appointments === 'manage' && prescriptions === 'manage') return 'full'
  if (appointments === 'manage' || prescriptions === 'manage') return 'more'
  return 'limited'
}

export function classifyRecordAccessTier(permissions: SharePermissionSet): AccessTier {
  const openSections = recordKeys.filter((k) => permissions.recordSections[k] !== 'none')
  if (openSections.length === 0) return 'none'

  const allCount = openSections.filter((k) => permissions.recordSections[k] === 'all').length
  const activeCount = openSections.filter(
    (k) => permissions.recordSections[k] === 'active',
  ).length

  if (openSections.length === recordKeys.length && allCount === recordKeys.length) {
    return 'full'
  }
  if (allCount > 0 && activeCount > 0) return 'more'
  if (allCount === openSections.length) return 'more'
  return 'limited'
}

function summarizeAppointmentsPrescriptions(permissions: SharePermissionSet): {
  summary: string
  detail: { label: string; value: string }[]
} {
  const { appointments, prescriptions } = permissions
  const detail = [
    { label: 'Appointments', value: featureAccessLabels[appointments] },
    { label: 'Repeat prescriptions', value: featureAccessLabels[prescriptions] },
  ]

  if (appointments === 'none' && prescriptions === 'none') {
    return {
      summary: 'Cannot access your appointments and prescriptions',
      detail,
    }
  }

  if (appointments === 'manage' && prescriptions === 'manage') {
    return {
      summary: 'Can manage your appointments and prescriptions',
      detail,
    }
  }

  if (appointments === 'view' && prescriptions === 'view') {
    return {
      summary: 'Can view your appointments and prescriptions',
      detail,
    }
  }

  const parts: string[] = []
  if (appointments === 'manage') parts.push('manage your appointments')
  else if (appointments === 'view') parts.push('view your appointments')

  if (prescriptions === 'manage') parts.push('manage your prescriptions')
  else if (prescriptions === 'view') parts.push('view your prescriptions')

  return {
    summary: parts.length > 0 ? `Can ${parts.join(' and ')}` : 'Cannot access your appointments and prescriptions',
    detail,
  }
}

function summarizeRecordAccess(permissions: SharePermissionSet): {
  summary: string
  detail: { label: string; value: string }[]
} {
  const detail = recordKeys.map((key) => ({
    label: recordSectionLabels[key],
    value: recordVisibilityLabels[permissions.recordSections[key]],
  }))

  const openSections = recordKeys.filter((k) => permissions.recordSections[k] !== 'none')

  if (openSections.length === 0) {
    return { summary: 'Cannot view your record', detail }
  }

  const activeCount = openSections.filter(
    (k) => permissions.recordSections[k] === 'active',
  ).length
  const allCount = openSections.filter((k) => permissions.recordSections[k] === 'all').length

  if (openSections.length === recordKeys.length && allCount === recordKeys.length) {
    return { summary: 'Can view everything', detail }
  }

  if (activeCount > 0 && allCount > 0) {
    return { summary: 'Can view a mix of active and historic information', detail }
  }

  if (allCount === openSections.length) {
    return { summary: 'Can view some aspects of your full record', detail }
  }

  return { summary: 'Can view some aspects of your active record', detail }
}

function isFullShareAccess(permissions: SharePermissionSet): boolean {
  if (permissions.appointments !== 'manage' || permissions.prescriptions !== 'manage') {
    return false
  }
  return recordKeys.every((k) => permissions.recordSections[k] === 'all')
}

function isReadOnlyShareAccess(permissions: SharePermissionSet): boolean {
  if (permissions.appointments === 'manage' || permissions.prescriptions === 'manage') {
    return false
  }
  if (recordKeys.some((k) => permissions.recordSections[k] === 'all')) {
    return false
  }
  return hasAnySharePermission(permissions)
}

export function classifyShareAccessLevel(
  permissions: SharePermissionSet,
): ShareAccessLevel {
  if (!hasAnySharePermission(permissions)) return 'none'
  if (isFullShareAccess(permissions)) return 'full'
  if (isReadOnlyShareAccess(permissions)) return 'read_only'
  return 'limited'
}

export function summarizeShareAccessParts(
  permissions: SharePermissionSet,
): ShareAccessSummaryParts {
  const apptRx = summarizeAppointmentsPrescriptions(permissions)
  const record = summarizeRecordAccess(permissions)

  return {
    appointmentsPrescriptions: apptRx.summary,
    record: record.summary,
    appointmentsPrescriptionsDetail: apptRx.detail,
    recordDetail: record.detail,
    appointmentsPrescriptionsTier: classifyAppointmentsPrescriptionsTier(permissions),
    recordTier: classifyRecordAccessTier(permissions),
    level: classifyShareAccessLevel(permissions),
  }
}

export function formatShareGrantSummary(
  permissions: SharePermissionSet,
  _activation: ShareActivation,
  _recipientName: string,
): string {
  const parts = summarizeShareAccessParts(permissions)
  return `${parts.appointmentsPrescriptions}. ${parts.record}.`
}

/** @deprecated Use summarizeShareAccessParts */
export function formatSharePermissionsSummary(permissions: SharePermissionSet): string {
  const parts = summarizeShareAccessParts(permissions)
  return parts.level === 'full'
    ? 'Full access'
    : parts.level === 'read_only'
      ? 'Read-only access'
      : parts.level === 'limited'
        ? 'Limited access'
        : 'No access'
}

export function effectiveShareStatus(
  share: HealthShare,
  lpaHealthWelfareActive: boolean,
): ShareStatus {
  if (share.status === 'revoked') return 'revoked'
  if (share.activation === 'lpa_gated' && !lpaHealthWelfareActive) return 'pending_lpa'
  return 'active'
}

export function effectiveSections(
  share: HealthShare,
  lpaHealthWelfareActive: boolean,
): ShareSection[] {
  if (share.permissions) {
    const sections: ShareSection[] = []
    if (share.permissions.appointments !== 'none') sections.push('appointments')
    if (share.permissions.prescriptions !== 'none') sections.push('prescriptions')
    if (recordKeys.some((k) => share.permissions.recordSections[k] !== 'none')) {
      sections.push('medical_records')
    }
    return sections
  }
  if (share.scope === 'full') {
    return Object.keys(shareSectionLabels) as ShareSection[]
  }
  const base = share.sections ?? []
  if (
    share.activation === 'lpa_expanded' &&
    lpaHealthWelfareActive &&
    share.lpaExpandedSections?.length
  ) {
    return [...new Set([...base, ...share.lpaExpandedSections])]
  }
  return base
}

export function formatShareSections(
  share: HealthShare,
  lpaHealthWelfareActive: boolean,
): string {
  if (share.permissions) {
    const parts = summarizeShareAccessParts(share.permissions)
    return `${parts.appointmentsPrescriptions}; ${parts.record}`
  }
  if (share.scope === 'full') return 'Full health record'
  const sections = effectiveSections(share, lpaHealthWelfareActive)
  return sections.map((s) => shareSectionLabels[s]).join(', ')
}

export function activeShareCount(
  shares: HealthShare[],
  lpaHealthWelfareActive: boolean,
): number {
  return shares.filter(
    (s) => effectiveShareStatus(s, lpaHealthWelfareActive) === 'active',
  ).length
}

export function mostRecentShareAccess(shares: HealthShare[]): string | null {
  const times = shares
    .filter((s) => s.status !== 'revoked' && s.lastAccessedAt)
    .map((s) => s.lastAccessedAt!)
  if (times.length === 0) return null
  return times.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
}

export function shareStatusLabel(status: ShareStatus): string {
  switch (status) {
    case 'active':
      return 'Active'
    case 'revoked':
      return 'Revoked'
    case 'pending_lpa':
      return 'Awaiting LPA'
  }
}

export function shareStatusVariant(
  status: ShareStatus,
): 'success' | 'warning' | 'danger' | 'muted' {
  switch (status) {
    case 'active':
      return 'success'
    case 'pending_lpa':
      return 'warning'
    case 'revoked':
      return 'muted'
  }
}

/** Migrate persisted shares missing permissions */
export function normalizeSharePermissions(share: HealthShare): SharePermissionSet {
  if (share.permissions) return share.permissions

  const permissions = defaultSharePermissions()

  if (share.scope === 'full') {
    permissions.appointments = 'manage'
    permissions.prescriptions = 'manage'
    for (const k of recordKeys) permissions.recordSections[k] = 'all'
    return permissions
  }

  for (const s of share.sections ?? []) {
    if (s === 'appointments') permissions.appointments = 'view'
    if (s === 'prescriptions') permissions.prescriptions = 'view'
    if (s === 'medications') permissions.recordSections.medications = 'active'
    if (s === 'conditions') permissions.recordSections.conditions = 'active'
    if (s === 'medical_records') {
      for (const k of recordKeys) permissions.recordSections[k] = 'active'
    }
  }

  return permissions
}
