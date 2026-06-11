import { useEffect, useState } from 'react'
import { Modal } from '../shared/Modal'
import { Button } from '../shared/Button'
import type { Prescription } from '../../types/prescription'

interface MarkCollectedModalProps {
  open: boolean
  prescription: Prescription | null
  onClose: () => void
  onConfirm: (note?: string) => void
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
}

export function MarkCollectedModal({
  open,
  prescription,
  onClose,
  onConfirm,
}: MarkCollectedModalProps) {
  const [note, setNote] = useState('')

  useEffect(() => {
    if (open) setNote('')
  }, [open, prescription?.id])

  if (!prescription) return null

  return (
    <Modal open={open} onClose={onClose} title="Mark as collected">
      <p className="text-sm text-gray-600 mb-4">
        This records that you have collected your prescription. It is based on what you
        tell us — ELM cannot confirm collection from your pharmacy.
      </p>

      <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-sm text-amber-900 mb-4">
        Reported by you — not from your GP or pharmacy systems
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-100 p-3 text-sm mb-4">
        <div className="font-medium text-gray-900">{prescription.medication}</div>
        {prescription.orderPharmacyName && (
          <div className="text-gray-500 text-xs mt-1">
            Collect from {prescription.orderPharmacyName}
          </div>
        )}
      </div>

      <div className="mb-6">
        <FieldLabel>Note (optional)</FieldLabel>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 150))}
          rows={2}
          maxLength={150}
          placeholder="e.g. Collected from pharmacy today"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-nhs-blue focus:ring-1 focus:ring-nhs-blue"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="nhs" onClick={() => onConfirm(note.trim() || undefined)}>
          Mark as collected
        </Button>
      </div>
    </Modal>
  )
}
