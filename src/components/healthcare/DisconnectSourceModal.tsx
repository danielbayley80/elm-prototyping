import { Modal } from '../shared/Modal'
import { Button } from '../shared/Button'
import type { ConnectedHealthSource } from '../../types/health-connection'

interface DisconnectSourceModalProps {
  source: ConnectedHealthSource | null
  open: boolean
  onClose: () => void
  onDisconnectKeepData: (sourceId: string) => void
  onDisconnectRemoveData: (sourceId: string) => void
}

export function DisconnectSourceModal({
  source,
  open,
  onClose,
  onDisconnectKeepData,
  onDisconnectRemoveData,
}: DisconnectSourceModalProps) {
  if (!source) return null

  return (
    <Modal open={open} onClose={onClose} title={`Disconnect ${source.name}?`}>
      <p className="text-sm text-gray-600 mb-6">
        Choose what should happen to the health data synced from this source.
      </p>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => {
            onDisconnectKeepData(source.id)
            onClose()
          }}
          className="w-full text-left rounded-lg border border-gray-200 p-4 hover:border-nhs-blue hover:bg-blue-50/50 transition-colors"
        >
          <div className="font-medium text-gray-900">Disconnect and keep data</div>
          <p className="text-sm text-gray-500 mt-1">
            Stop syncing from this source. Your existing records, appointments, and
            prescriptions will remain in ELM.
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            onDisconnectRemoveData(source.id)
            onClose()
          }}
          className="w-full text-left rounded-lg border border-red-200 p-4 hover:border-red-300 hover:bg-red-50/50 transition-colors"
        >
          <div className="font-medium text-red-900">Disconnect and remove data</div>
          <p className="text-sm text-gray-500 mt-1">
            Stop syncing and delete health data from this source held in ELM. This cannot
            be undone.
          </p>
        </button>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
