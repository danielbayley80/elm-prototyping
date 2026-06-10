import { useState } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { HealthcarePage } from '../../components/layout/HealthcarePage'
import { Button } from '../../components/shared/Button'
import { StatusBadge } from '../../components/shared/Badge'
import { Modal } from '../../components/shared/Modal'
import { mockAvailableSlots } from '../../mocks/appointments'
import type { Appointment } from '../../mocks/appointments'
import { useHealth } from '../../lib/health-context'
import { formatDateTime } from '../../lib/utils'

export function AppointmentsPage() {
  const { appointments, connection, bookAppointment, cancelAppointment } = useHealth()
  const [bookOpen, setBookOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const upcoming = appointments
    .filter((a) => a.status === 'booked')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())

  const past = appointments
    .filter((a) => a.status !== 'booked')
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())

  const handleBook = () => {
    const slot = mockAvailableSlots.find((s) => s.id === selectedSlot)
    if (!slot) return

    const newAppt: Appointment = {
      id: `apt-${Date.now()}`,
      appointmentId: `cnv-apt-${Date.now()}`,
      type: slot.type,
      clinician: slot.clinician,
      location: slot.locationName,
      dateTime: slot.dateTime,
      duration: 15,
      status: 'booked',
      canBeCancelled: true,
    }
    bookAppointment(newAppt)
    setBookOpen(false)
    setSelectedSlot(null)
  }

  return (
    <HealthcarePage
      title="Appointments"
      description="Book, view, and manage GP appointments."
      action={
        <Button variant="nhs" size="sm" onClick={() => setBookOpen(true)}>
          <Plus className="h-4 w-4" />
          Book appointment
        </Button>
      }
    >

      {connection.syncPreferences.appointmentsToCalendar && (
        <div className="mb-6 flex items-center gap-2 text-sm text-cyan-700 bg-cyan-50 border border-cyan-100 rounded-lg px-4 py-3">
          <Calendar className="h-4 w-4" />
          Appointments are synced to your ELM calendar
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming appointments.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onCancel={() => cancelAppointment(appt.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Past</h2>
        <div className="space-y-3">
          {past.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      </section>

      <Modal open={bookOpen} onClose={() => setBookOpen(false)} title="Book an appointment">
        <p className="text-sm text-gray-500 mb-4">
          Select an available slot. Production uses GET /patient/&#123;patientId&#125;/appointment-slot
          with start-date and days-number, then POST with appointmentSlotId.
        </p>
        <div className="space-y-2">
          {mockAvailableSlots.map((slot) => (
            <label
              key={slot.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedSlot === slot.id
                  ? 'border-nhs-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="slot"
                value={slot.id}
                checked={selectedSlot === slot.id}
                onChange={() => setSelectedSlot(slot.id)}
                className="text-nhs-blue focus:ring-nhs-blue"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{slot.type}</div>
                <div className="text-sm text-gray-500">
                  {slot.clinician} — {formatDateTime(slot.dateTime)}
                </div>
              </div>
            </label>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => setBookOpen(false)}>
            Cancel
          </Button>
          <Button variant="nhs" disabled={!selectedSlot} onClick={handleBook}>
            Confirm booking
          </Button>
        </div>
      </Modal>
    </HealthcarePage>
  )
}

function AppointmentCard({
  appointment,
  onCancel,
}: {
  appointment: Appointment
  onCancel?: () => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{appointment.type}</span>
          <StatusBadge status={appointment.status} />
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {appointment.clinician} · {appointment.location}
        </div>
        <div className="text-sm text-gray-600 mt-0.5">
          {formatDateTime(appointment.dateTime)} · {appointment.duration} min
        </div>
        {appointment.notes && (
          <div className="text-xs text-gray-400 mt-1">{appointment.notes}</div>
        )}
      </div>
      {onCancel && appointment.status === 'booked' && appointment.canBeCancelled !== false && (
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  )
}
