import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Modal } from '../shared/Modal'
import { Button } from '../shared/Button'
import { fetchAppointmentSlotsSimulated } from '../../mocks/appointments'
import { formatAppointmentType, type AppointmentSlot, type BookAppointmentParams, type TelephoneContactType } from '../../types/appointment'
import type { AppointmentBookingReasonRequirement } from '../../types/source-capabilities'
import { formatDateTime } from '../../lib/utils'

type BookStep = 'search' | 'slots' | 'details'

interface BookAppointmentModalProps {
  open: boolean
  onClose: () => void
  onBook: (params: BookAppointmentParams) => void
  bookingReasonRequirement: AppointmentBookingReasonRequirement
  defaultPhone?: string
  title?: string
  intro?: string
}

const DAY_OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 28, label: '28 days' },
]

const CONTACT_TYPES: { value: TelephoneContactType; label: string }[] = [
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Home', label: 'Home' },
  { value: 'Work', label: 'Work' },
  { value: 'Other', label: 'Other' },
  { value: 'Unknown', label: 'Unknown' },
]

function defaultStartDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
}

export function BookAppointmentModal({
  open,
  onClose,
  onBook,
  bookingReasonRequirement,
  defaultPhone = '',
  title = 'Book an appointment',
  intro,
}: BookAppointmentModalProps) {
  const [step, setStep] = useState<BookStep>('search')
  const [startDate, setStartDate] = useState(defaultStartDate)
  const [daysNumber, setDaysNumber] = useState(14)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slots, setSlots] = useState<AppointmentSlot[]>([])
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [bookingReason, setBookingReason] = useState('')
  const [telephoneNumber, setTelephoneNumber] = useState(defaultPhone)
  const [telephoneContactType, setTelephoneContactType] =
    useState<TelephoneContactType>('Mobile')
  const [slotError, setSlotError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setStep('search')
    setStartDate(defaultStartDate())
    setDaysNumber(14)
    setLoadingSlots(false)
    setSlots([])
    setSelectedSlotId(null)
    setBookingReason('')
    setTelephoneNumber(defaultPhone)
    setTelephoneContactType('Mobile')
    setSlotError(null)
  }, [open, defaultPhone])

  const selectedSlot = slots.find((s) => s.id === selectedSlotId) ?? null
  const reasonRequired = bookingReasonRequirement === 'required'
  const reasonOptional = bookingReasonRequirement === 'optional'
  const showReasonField = reasonRequired || reasonOptional

  const handleFindSlots = async () => {
    setLoadingSlots(true)
    setSlotError(null)
    setSelectedSlotId(null)
    try {
      const results = await fetchAppointmentSlotsSimulated(startDate, daysNumber)
      setSlots(results)
      setStep('slots')
      if (results.length === 0) {
        setSlotError('No bookable slots in this date range. Try a different start date or wider window.')
      }
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleConfirmBook = () => {
    if (!selectedSlot) return
    if (reasonRequired && !bookingReason.trim()) return
    if (!telephoneNumber.trim()) return

    onBook({
      slot: selectedSlot,
      bookingReason: bookingReason.trim() || undefined,
      telephoneNumber: telephoneNumber.trim(),
      telephoneContactType,
    })
  }

  const detailsValid =
    !!selectedSlot &&
    !!telephoneNumber.trim() &&
    (!reasonRequired || !!bookingReason.trim())

  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-xl">
      {intro && <p className="text-sm text-gray-600 mb-4">{intro}</p>}

      {step === 'search' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose when you would like to start looking for appointments with your GP practice.
          </p>

          <div>
            <FieldLabel>Start date</FieldLabel>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-nhs-blue focus:ring-1 focus:ring-nhs-blue"
            />
          </div>

          <div>
            <FieldLabel>Search window</FieldLabel>
            <select
              value={daysNumber}
              onChange={(e) => setDaysNumber(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-nhs-blue focus:ring-1 focus:ring-nhs-blue"
            >
              {DAY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Next {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="nhs" disabled={!startDate || loadingSlots} onClick={handleFindSlots}>
              {loadingSlots ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching…
                </>
              ) : (
                'Find available slots'
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 'slots' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {slots.length} slot{slots.length !== 1 ? 's' : ''} from{' '}
            {new Date(startDate).toLocaleDateString('en-GB')} over {daysNumber} days
          </p>

          {slotError && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              {slotError}
            </p>
          )}

          {slots.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {slots.map((slot) => (
                <label
                  key={slot.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSlotId === slot.id
                      ? 'border-nhs-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="slot"
                    value={slot.id}
                    checked={selectedSlotId === slot.id}
                    onChange={() => setSelectedSlotId(slot.id)}
                    className="mt-1 text-nhs-blue focus:ring-nhs-blue"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {formatAppointmentType(slot.slotTypeName, slot.sessionType)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {slot.clinicianDisplayName} — {formatDateTime(slot.startTime)}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {slot.locationName}
                      {slot.locationAddress ? ` · ${slot.locationAddress}` : ''}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-between gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep('search')}>
              Change dates
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="nhs"
                disabled={!selectedSlotId}
                onClick={() => setStep('details')}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 'details' && selectedSlot && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg border border-gray-100 p-3 text-sm">
            <div className="font-medium text-gray-900">
              {formatAppointmentType(selectedSlot.slotTypeName, selectedSlot.sessionType)}
            </div>
            <div className="text-gray-600 mt-1">
              {selectedSlot.clinicianDisplayName} · {formatDateTime(selectedSlot.startTime)}
            </div>
            <div className="text-gray-500 text-xs mt-1">{selectedSlot.locationName}</div>
          </div>

          <p className="text-sm text-gray-600">
            Your practice needs a contact number to confirm this booking.
          </p>

          {showReasonField && (
            <div>
              <FieldLabel>
                Reason for appointment
                {reasonRequired ? ' (required)' : ' (optional)'}
              </FieldLabel>
              <textarea
                value={bookingReason}
                onChange={(e) => setBookingReason(e.target.value.slice(0, 150))}
                rows={3}
                maxLength={150}
                placeholder="Briefly describe why you need this appointment"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-nhs-blue focus:ring-1 focus:ring-nhs-blue"
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {bookingReason.length}/150
              </div>
            </div>
          )}

          <div>
            <FieldLabel>Telephone number (required)</FieldLabel>
            <input
              type="tel"
              value={telephoneNumber}
              onChange={(e) => setTelephoneNumber(e.target.value)}
              placeholder="e.g. 07700900123"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-nhs-blue focus:ring-1 focus:ring-nhs-blue"
            />
          </div>

          <div>
            <FieldLabel>Contact type</FieldLabel>
            <select
              value={telephoneContactType}
              onChange={(e) =>
                setTelephoneContactType(e.target.value as TelephoneContactType)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-nhs-blue focus:ring-1 focus:ring-nhs-blue"
            >
              {CONTACT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep('slots')}>
              Back
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="nhs" disabled={!detailsValid} onClick={handleConfirmBook}>
                Confirm booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
