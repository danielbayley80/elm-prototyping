import { Link } from 'react-router-dom'
import { getSourceSystem } from '../../config/source-config'
import type { ConnectedHealthSource } from '../../types/health-connection'
import {
  getAggregateSyncStatus,
  syncStatusLabel,
  type SourceSyncStatus,
} from '../../types/health-connection'
import { Badge } from '../shared/Badge'

function statusDisplayLabel(sources: ConnectedHealthSource[]): string {
  const aggregate = getAggregateSyncStatus(sources)
  if (!aggregate || aggregate === 'up-to-date') return 'Up to date'
  return syncStatusLabel(aggregate)
}

function hasSyncProblem(sources: ConnectedHealthSource[]): boolean {
  const aggregate = getAggregateSyncStatus(sources)
  return aggregate === 'error' || aggregate === 'sync-failed'
}

function statusBadgeVariant(
  aggregate: SourceSyncStatus | null,
): 'success' | 'warning' | 'danger' | 'info' {
  if (!aggregate || aggregate === 'up-to-date') return 'success'
  if (aggregate === 'syncing') return 'info'
  if (aggregate === 'error' || aggregate === 'sync-failed') return 'danger'
  return 'warning'
}

export function RecordsSyncBanner({ sources }: { sources: ConnectedHealthSource[] }) {
  const aggregate = getAggregateSyncStatus(sources)
  const label = statusDisplayLabel(sources)
  const problem = hasSyncProblem(sources)
  const variant = statusBadgeVariant(aggregate)

  const badge = <Badge variant={variant}>{label}</Badge>

  return (
    <div className="flex flex-col items-end gap-1 text-sm shrink-0 self-start sm:mt-0.5">
      <span className="text-gray-500">Sync status</span>
      {problem ? (
        <Link to="/healthcare/sources" className="hover:opacity-90 transition-opacity">
          {badge}
        </Link>
      ) : (
        badge
      )}
    </div>
  )
}

function SourceBadge({ sourceSystem }: { sourceSystem?: string }) {
  const source = getSourceSystem(sourceSystem)
  if (!source) return <span className="text-gray-400">—</span>

  return (
    <span
      className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: source.color + '18', color: source.color }}
    >
      {source.shortLabel}
    </span>
  )
}

export { SourceBadge }
