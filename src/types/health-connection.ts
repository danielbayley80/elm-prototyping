export type DisconnectMode = 'keep-data' | 'remove-data'

export type SourceSyncStatus = 'up-to-date' | 'sync-failed' | 'error' | 'syncing'

export interface ConnectedHealthSource {
  id: string
  name: string
  region: string
  connectedAt: string
  lastSyncedAt: string
  syncStatus: SourceSyncStatus
  practiceName?: string
  patientId?: string
  capabilities?: import('./source-capabilities').SourceCapabilities
}

export interface SyncPreferences {
  appointmentsToCalendar: boolean
  prescriptionsToCalendar: boolean
  notificationsEnabled: boolean
}

export interface PendingConnection {
  sourceId: string
  sourceName: string
  region: string
  gpCredentials: import('../mocks/nhs-login').GpCredentials | null
  patientId: string | null
  consentGiven: boolean
}

export interface HealthConnection {
  connectedSources: ConnectedHealthSource[]
  syncPreferences: SyncPreferences
  pending: PendingConnection | null
}

export function isConnected(connection: HealthConnection): boolean {
  return connection.connectedSources.length > 0
}

export function getAggregateSyncStatus(
  sources: ConnectedHealthSource[],
): SourceSyncStatus | null {
  if (sources.length === 0) return null
  if (sources.some((s) => s.syncStatus === 'error')) return 'error'
  if (sources.some((s) => s.syncStatus === 'sync-failed')) return 'sync-failed'
  if (sources.some((s) => s.syncStatus === 'syncing')) return 'syncing'
  return 'up-to-date'
}

export function syncStatusLabel(status: SourceSyncStatus): string {
  switch (status) {
    case 'up-to-date':
      return 'Up to date'
    case 'sync-failed':
      return 'Sync failed'
    case 'error':
      return 'Error'
    case 'syncing':
      return 'Syncing…'
  }
}
