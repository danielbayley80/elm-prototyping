import { useEffect, useState } from 'react'
import { Modal } from '../shared/Modal'
import { Button } from '../shared/Button'
import type { Appointment } from '../../types/appointment'
import { formatDateTime } from '../../lib/utils'

interface CancelAppointmentModalProps {
  open: boolean
  appointment: Appointment | null
  onClose: () => void
  onConfirm: (cancellationReason: string) => void
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
}

export function CancelAppointmentModal({
  open,
  appointment,
  onClose,
  onConfirm,
}: CancelAppointmentModalProps) {
  const [cancellationReason, setCancellationReason] = useState('')

  useEffect(() => {
    if (open) setCancellationReason('')
  }, [open, appointment?.id])

  if (!appointment) return null

  return (
    <Modal open={open} onClose={onClose} title="Cancel appointment">
      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to cancel this appointment? Please tell us why so your
        practice can update their records.
      </p>

      <div className="bg-gray-50 rounded-lg border border-gray-100 p-3 text-sm mb-4">
        <div className="font-medium text-gray-900">{appointment.type}</div>
        <div className="text-gray-600 mt-1">
          {appointment.clinician} · {formatDateTime(appointment.startTime)}
        </div>
        <div className="text-gray-500 text-xs mt-1">{appointment.location}</div>
      </div>

      <div className="mb-6">
        <FieldLabel>Cancellation reason (required)</FieldLabel>
        <textarea
          value={cancellationReason}
          onChange={(e) => setCancellationReason(e.target.value.slice(0, 150))}
          rows={3}
          maxLength={150}
          placeholder="e.g. No longer need this appointment"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-nhs-blue focus:ring-1 focus:ring-nhs-blue"
        />
        <div className="text-xs text-gray-400 mt-1 text-right">
          {cancellationReason.length}/150
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Keep appointment
        </Button>
        <Button
          variant="danger"
          disabled={!cancellationReason.trim()}
          onClick={() => onConfirm(cancellationReason.trim())}
        >
          Confirm cancellation
        </Button>
      </div>
    </Modal>
  )
}
