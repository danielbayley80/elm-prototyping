export type AppointmentStatus = 'booked' | 'cancelled' | 'completed'

export type TelephoneContactType = 'Unknown' | 'Home' | 'Work' | 'Mobile' | 'Other'

export type AppointmentBookingReasonRequirement = 'notRequested' | 'required' | 'optional'

/** Convenet GET /patient/{patientId}/appointment list item */
export interface Appointment {
  id: string
  appointmentId: string
  slotTypeName: string
  sessionType?: string
  /** Display label derived from slotTypeName / sessionType */
  type: string
  clinician: string
  location: string
  locationAddress?: string
  startTime: string
  endTime: string
  /** Alias for startTime — used in sorting/display helpers */
  dateTime: string
  duration: number
  status: AppointmentStatus
  canBeCancelled?: boolean
  bookingDate?: string
  bookingReason?: string
  cancellationReason?: string
}

/** Convenet GET /patient/{patientId}/appointment-slot item */
export interface AppointmentSlot {
  id: string
  appointmentSlotId: string
  slotTypeName: string
  sessionType?: string
  slotTypeStatus?: string
  clinicianDisplayName: string
  locationName: string
  locationAddress?: string
  locationPostcode?: string
  startTime: string
  endTime: string
}

export interface BookAppointmentParams {
  slot: AppointmentSlot
  bookingReason?: string
  telephoneNumber: string
  telephoneContactType: TelephoneContactType
}

export interface CancelAppointmentParams {
  appointmentId: string
  cancellationReason: string
}

export function formatAppointmentType(slotTypeName: string, sessionType?: string): string {
  if (sessionType && sessionType !== slotTypeName) {
    return `${slotTypeName} (${sessionType})`
  }
  return slotTypeName
}

export function computeDurationMinutes(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  return Math.max(1, Math.round((end - start) / 60_000))
}
