import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Plus } from 'lucide-react'
import { HealthcarePage } from '../../components/layout/HealthcarePage'
import { BookAppointmentModal } from '../../components/appointments/BookAppointmentModal'
import { CancelAppointmentModal } from '../../components/appointments/CancelAppointmentModal'
import { Button } from '../../components/shared/Button'
import { StatusBadge } from '../../components/shared/Badge'
import { getAppointmentsAccess, getPrimarySourceCapabilities } from '../../lib/appointment-access'
import { useHealth } from '../../lib/health-context'
import { mockNhsLoginUser } from '../../mocks/nhs-login'
import type { Appointment, BookAppointmentParams } from '../../types/appointment'
import { isConnected } from '../../types/health-connection'
import { formatDateTime } from '../../lib/utils'

export function AppointmentsPage() {
  const navigate = useNavigate()
  const { appointments, connection, bookAppointment, cancelAppointment } = useHealth()
  const [bookOpen, setBookOpen] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null)

  if (!isConnected(connection)) {
    navigate('/healthcare', { replace: true })
    return null
  }

  const capabilities = getPrimarySourceCapabilities(connection.connectedSources)
  const access = getAppointmentsAccess(capabilities)
  const bookingReasonRequirement =
    capabilities?.inputRequirements.appointmentBookingReason ?? 'required'

  const upcoming = appointments
    .filter((a) => a.status === 'booked')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const past = appointments
    .filter((a) => a.status !== 'booked')
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  const handleBook = (params: BookAppointmentParams) => {
    bookAppointment(params)
    setBookOpen(false)
  }

  const handleCancelConfirm = (cancellationReason: string) => {
    if (!cancelTarget) return
    cancelAppointment(cancelTarget.id, cancellationReason)
    setCancelTarget(null)
  }

  return (
    <HealthcarePage
      title="Appointments"
      description="Book, view, and manage GP appointments from your connected practice."
      action={
        access.canBook ? (
          <Button variant="nhs" size="sm" onClick={() => setBookOpen(true)}>
            <Plus className="h-4 w-4" />
            Book appointment
          </Button>
        ) : undefined
      }
    >
      {!access.available && access.disabledReason && (
        <div className="mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          {access.disabledReason}
        </div>
      )}

      {connection.syncPreferences.appointmentsToCalendar && (
        <div className="mb-6 flex items-center gap-2 text-sm text-cyan-700 bg-cyan-50 border border-cyan-100 rounded-lg px-4 py-3">
          <Calendar className="h-4 w-4" />
          Appointments are synced to your ELM calendar
        </div>
      )}

      {access.available && (
        <>
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
                    onCancel={() => setCancelTarget(appt)}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Past and cancelled</h2>
            {past.length === 0 ? (
              <p className="text-sm text-gray-500">No past appointments.</p>
            ) : (
              <div className="space-y-3">
                {past.map((appt) => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <BookAppointmentModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        onBook={handleBook}
        bookingReasonRequirement={bookingReasonRequirement}
        defaultPhone={mockNhsLoginUser.mobilePhone}
      />

      <CancelAppointmentModal
        open={!!cancelTarget}
        appointment={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
      />
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
  const showCancel =
    onCancel &&
    appointment.status === 'booked' &&
    appointment.canBeCancelled !== false

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900">{appointment.type}</span>
          <StatusBadge status={appointment.status} />
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {appointment.clinician} · {appointment.location}
        </div>
        <div className="text-sm text-gray-600 mt-0.5">
          {formatDateTime(appointment.startTime)} · {appointment.duration} min
        </div>
        {appointment.bookingReason && (
          <div className="text-xs text-gray-500 mt-1">
            Booking reason: {appointment.bookingReason}
          </div>
        )}
        {appointment.cancellationReason && (
          <div className="text-xs text-gray-500 mt-1">
            Cancellation reason: {appointment.cancellationReason}
          </div>
        )}
      </div>
      {showCancel && (
        <Button variant="outline" size="sm" onClick={onCancel} className="shrink-0">
          Cancel
        </Button>
      )}
    </div>
  )
}
