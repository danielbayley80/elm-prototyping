import { Modal } from '../shared/Modal'
import { Button } from '../shared/Button'
import type { HealthShare } from '../../types/health-sharing'

interface RevokeShareModalProps {
  share: HealthShare | null
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function RevokeShareModal({
  share,
  open,
  onClose,
  onConfirm,
}: RevokeShareModalProps) {
  if (!share) return null

  return (
    <Modal open={open} onClose={onClose} title={`Revoke access for ${share.recipientName}?`}>
      <p className="text-sm text-gray-600 mb-4">
        {share.recipientName} will no longer be able to view your shared health data.
        Access stops immediately.
      </p>
      <p className="text-sm text-gray-600 mb-6">
        This sharing arrangement will be marked as <strong>revoked</strong> and kept in
        your audit history. It will not be deleted.
      </p>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Revoke access
        </Button>
      </div>
    </Modal>
  )
}
