import { Link } from 'react-router-dom'
import { Link2 } from 'lucide-react'
import { getAggregateSyncStatus, isConnected, syncStatusLabel } from '../../types/health-connection'
import { useHealth } from '../../lib/health-context'

const statusVariant = {
  'up-to-date': 'text-green-600',
  'sync-failed': 'text-amber-600',
  error: 'text-red-600',
  syncing: 'text-blue-600',
} as const

export function SourcesStatusCard() {
  const { connection } = useHealth()
  const count = connection.connectedSources.length
  const aggregateStatus = getAggregateSyncStatus(connection.connectedSources)

  if (!isConnected(connection) || !aggregateStatus) return null

  return (
    <Link
      to="/healthcare/sources"
      className="block h-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-nhs-blue/30 transition-colors"
    >
      <Link2 className="h-6 w-6 text-nhs-blue mb-3" />
      <h3 className="font-semibold text-gray-900">Sources connected</h3>
      <p className="text-sm text-gray-500 mt-1">
        {count} source{count !== 1 ? 's' : ''} ·{' '}
        <span className={statusVariant[aggregateStatus]}>
          {syncStatusLabel(aggregateStatus)}
        </span>
      </p>
      <p className="text-sm text-gray-500 mt-1">
        View and manage your connected health sources
      </p>
    </Link>
  )
}
