export type AppointmentStatus = 'booked' | 'cancelled' | 'completed'

export interface Appointment {
  id: string
  /** Convenet: appointmentId */
  appointmentId: string
  type: string
  clinician: string
  location: string
  dateTime: string
  duration: number
  status: AppointmentStatus
  canBeCancelled?: boolean
  notes?: string
}

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    appointmentId: 'cnv-apt-001',
    type: 'GP Review',
    clinician: 'Dr Sarah Patel',
    location: 'Riverside Medical Centre',
    dateTime: '2026-06-20T09:30:00Z',
    duration: 15,
    status: 'booked',
    canBeCancelled: true,
    notes: 'Diabetes and hypertension follow-up',
  },
  {
    id: 'apt-002',
    appointmentId: 'cnv-apt-002',
    type: 'Blood Test',
    clinician: 'Phlebotomy Clinic',
    location: 'Riverside Medical Centre',
    dateTime: '2026-06-25T08:00:00Z',
    duration: 10,
    status: 'booked',
    canBeCancelled: true,
    notes: 'Fasting bloods — HbA1c and lipid panel',
  },
  {
    id: 'apt-003',
    appointmentId: 'cnv-apt-003',
    type: 'GP Consultation',
    clinician: 'Dr Sarah Patel',
    location: 'Riverside Medical Centre',
    dateTime: '2025-01-20T09:00:00Z',
    duration: 15,
    status: 'completed',
    canBeCancelled: false,
    notes: 'Annual diabetes review',
  },
  {
    id: 'apt-004',
    appointmentId: 'cnv-apt-004',
    type: 'Flu Vaccination',
    clinician: 'Nurse Emma Clarke',
    location: 'Riverside Medical Centre',
    dateTime: '2024-09-18T11:00:00Z',
    duration: 10,
    status: 'completed',
    canBeCancelled: false,
  },
]

export interface AppointmentSlot {
  id: string
  /** Convenet: appointmentSlotId — required for POST /patient/{patientId}/appointment */
  appointmentSlotId: string
  dateTime: string
  endTime: string
  clinician: string
  type: string
  locationName: string
}

export const mockAvailableSlots: AppointmentSlot[] = [
  {
    id: 'slot-001',
    appointmentSlotId: 'cnv-slot-001',
    dateTime: '2026-06-27T09:00:00Z',
    endTime: '2026-06-27T09:15:00Z',
    clinician: 'Dr Sarah Patel',
    type: 'GP Consultation',
    locationName: 'Riverside Medical Centre',
  },
  {
    id: 'slot-002',
    appointmentSlotId: 'cnv-slot-002',
    dateTime: '2026-06-27T11:30:00Z',
    endTime: '2026-06-27T11:45:00Z',
    clinician: 'Dr Sarah Patel',
    type: 'GP Consultation',
    locationName: 'Riverside Medical Centre',
  },
  {
    id: 'slot-003',
    appointmentSlotId: 'cnv-slot-003',
    dateTime: '2026-06-28T14:00:00Z',
    endTime: '2026-06-28T14:15:00Z',
    clinician: 'Dr Ahmed Khan',
    type: 'GP Consultation',
    locationName: 'Riverside Medical Centre',
  },
  {
    id: 'slot-004',
    appointmentSlotId: 'cnv-slot-004',
    dateTime: '2026-06-30T10:15:00Z',
    endTime: '2026-06-30T10:25:00Z',
    clinician: 'Nurse Emma Clarke',
    type: 'Nurse Appointment',
    locationName: 'Riverside Medical Centre',
  },
]
