import { useState } from 'react'
import { Link } from 'react-router-dom'
import { healthSources } from '../../mocks/health-sources'
import type { ConnectedHealthSource } from '../../types/health-connection'
import { syncStatusLabel } from '../../types/health-connection'
import { formatDateTime } from '../../lib/utils'
import { useHealth } from '../../lib/health-context'
import { DisconnectSourceModal } from './DisconnectSourceModal'
import { Badge } from '../shared/Badge'
import { Button } from '../shared/Button'

const statusVariant = {
  'up-to-date': 'success',
  'sync-failed': 'warning',
  error: 'danger',
  syncing: 'info',
} as const

export function ConnectedSourceCard({ source }: { source: ConnectedHealthSource }) {
  const { disconnectSource } = useHealth()
  const [disconnectOpen, setDisconnectOpen] = useState(false)
  const definition = healthSources.find((s) => s.id === source.id)
  const Icon = definition?.icon

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="p-3 rounded-lg bg-blue-50 shrink-0">
              <Icon className="h-6 w-6 text-nhs-blue" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900">{source.name}</h3>
              <Badge variant={statusVariant[source.syncStatus]}>
                {syncStatusLabel(source.syncStatus)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">{source.region}</p>
            {source.practiceName && (
              <p className="text-sm text-gray-600 mt-1">{source.practiceName}</p>
            )}
            <div className="text-xs text-gray-400 mt-3 space-y-1">
              <div>Connected {formatDateTime(source.connectedAt)}</div>
              <div>Last synced {formatDateTime(source.lastSyncedAt)}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between gap-3">
          <Link to={`/healthcare/sources/${source.id}/capabilities`}>
            <Button variant="outline" size="sm">
              View GP services
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => setDisconnectOpen(true)}>
            Disconnect
          </Button>
        </div>
      </div>

      <DisconnectSourceModal
        source={source}
        open={disconnectOpen}
        onClose={() => setDisconnectOpen(false)}
        onDisconnectKeepData={(id) => disconnectSource(id, 'keep-data')}
        onDisconnectRemoveData={(id) => disconnectSource(id, 'remove-data')}
      />
    </>
  )
}
