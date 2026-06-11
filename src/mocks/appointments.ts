import {
  computeDurationMinutes,
  formatAppointmentType,
  type Appointment,
  type AppointmentSlot,
} from '../types/appointment'

export type {
  Appointment,
  AppointmentSlot,
  AppointmentStatus,
  BookAppointmentParams,
  CancelAppointmentParams,
  TelephoneContactType,
} from '../types/appointment'

const PRACTICE = 'Riverside Medical Centre'
const PRACTICE_ADDRESS = '42 River Lane, Manchester, M1 2AB'

function makeAppointment(
  partial: Omit<Appointment, 'type' | 'dateTime' | 'duration'> & {
    slotTypeName: string
    sessionType?: string
  },
): Appointment {
  const duration = computeDurationMinutes(partial.startTime, partial.endTime)
  return {
    ...partial,
    type: formatAppointmentType(partial.slotTypeName, partial.sessionType),
    dateTime: partial.startTime,
    duration,
  }
}

export const mockAppointments: Appointment[] = [
  makeAppointment({
    id: 'apt-001',
    appointmentId: 'cnv-apt-001',
    slotTypeName: 'GP Review',
    sessionType: 'Routine',
    clinician: 'Dr Sarah Patel',
    location: PRACTICE,
    locationAddress: PRACTICE_ADDRESS,
    startTime: '2026-06-20T09:30:00Z',
    endTime: '2026-06-20T09:45:00Z',
    status: 'booked',
    canBeCancelled: true,
    bookingDate: '2026-05-28T14:22:00Z',
    bookingReason: 'Diabetes and hypertension follow-up',
  }),
  makeAppointment({
    id: 'apt-002',
    appointmentId: 'cnv-apt-002',
    slotTypeName: 'Blood Test',
    sessionType: 'Phlebotomy',
    clinician: 'Phlebotomy Clinic',
    location: PRACTICE,
    locationAddress: PRACTICE_ADDRESS,
    startTime: '2026-06-25T08:00:00Z',
    endTime: '2026-06-25T08:10:00Z',
    status: 'booked',
    canBeCancelled: true,
    bookingDate: '2026-06-01T10:05:00Z',
    bookingReason: 'Fasting bloods — HbA1c and lipid panel',
  }),
  makeAppointment({
    id: 'apt-003',
    appointmentId: 'cnv-apt-003',
    slotTypeName: 'GP Consultation',
    sessionType: 'General',
    clinician: 'Dr Sarah Patel',
    location: PRACTICE,
    startTime: '2025-01-20T09:00:00Z',
    endTime: '2025-01-20T09:15:00Z',
    status: 'completed',
    canBeCancelled: false,
    bookingDate: '2025-01-10T16:40:00Z',
  }),
  makeAppointment({
    id: 'apt-004',
    appointmentId: 'cnv-apt-004',
    slotTypeName: 'Flu Vaccination',
    sessionType: 'Immunisation',
    clinician: 'Nurse Emma Clarke',
    location: PRACTICE,
    startTime: '2024-09-18T11:00:00Z',
    endTime: '2024-09-18T11:10:00Z',
    status: 'completed',
    canBeCancelled: false,
    bookingDate: '2024-09-01T09:12:00Z',
  }),
  makeAppointment({
    id: 'apt-005',
    appointmentId: 'cnv-apt-005',
    slotTypeName: 'GP Consultation',
    sessionType: 'General',
    clinician: 'Dr Ahmed Khan',
    location: PRACTICE,
    startTime: '2026-03-12T14:30:00Z',
    endTime: '2026-03-12T14:45:00Z',
    status: 'cancelled',
    canBeCancelled: false,
    bookingDate: '2026-03-01T11:00:00Z',
    cancellationReason: 'Unable to attend — rebooked for a later date',
  }),
]

interface SlotTemplate {
  hour: number
  minute: number
  durationMin: number
  slotTypeName: string
  sessionType: string
  clinicianDisplayName: string
}

const SLOT_TEMPLATES: SlotTemplate[] = [
  {
    hour: 9,
    minute: 0,
    durationMin: 15,
    slotTypeName: 'GP Consultation',
    sessionType: 'General',
    clinicianDisplayName: 'Dr Sarah Patel',
  },
  {
    hour: 11,
    minute: 30,
    durationMin: 15,
    slotTypeName: 'GP Consultation',
    sessionType: 'General',
    clinicianDisplayName: 'Dr Sarah Patel',
  },
  {
    hour: 14,
    minute: 0,
    durationMin: 15,
    slotTypeName: 'GP Consultation',
    sessionType: 'General',
    clinicianDisplayName: 'Dr Ahmed Khan',
  },
  {
    hour: 10,
    minute: 15,
    durationMin: 10,
    slotTypeName: 'Nurse Appointment',
    sessionType: 'Treatment room',
    clinicianDisplayName: 'Nurse Emma Clarke',
  },
  {
    hour: 8,
    minute: 0,
    durationMin: 10,
    slotTypeName: 'Blood Test',
    sessionType: 'Phlebotomy',
    clinicianDisplayName: 'Phlebotomy Clinic',
  },
  {
    hour: 15,
    minute: 45,
    durationMin: 15,
    slotTypeName: 'GP Review',
    sessionType: 'Routine',
    clinicianDisplayName: 'Dr Sarah Patel',
  },
]

function buildSlotPool(): AppointmentSlot[] {
  const slots: AppointmentSlot[] = []
  const poolStart = new Date('2026-06-10T00:00:00Z')
  let slotIndex = 1

  for (let dayOffset = 0; dayOffset < 60; dayOffset++) {
    const day = new Date(poolStart)
    day.setUTCDate(poolStart.getUTCDate() + dayOffset)
    const weekday = day.getUTCDay()
    if (weekday === 0 || weekday === 6) continue

    const templatesForDay =
      dayOffset % 3 === 0
        ? SLOT_TEMPLATES
        : dayOffset % 2 === 0
          ? SLOT_TEMPLATES.slice(0, 4)
          : SLOT_TEMPLATES.slice(0, 3)

    for (const template of templatesForDay) {
      const start = new Date(day)
      start.setUTCHours(template.hour, template.minute, 0, 0)
      const end = new Date(start)
      end.setUTCMinutes(end.getUTCMinutes() + template.durationMin)

      slots.push({
        id: `slot-${String(slotIndex).padStart(3, '0')}`,
        appointmentSlotId: `cnv-slot-${String(slotIndex).padStart(3, '0')}`,
        slotTypeName: template.slotTypeName,
        sessionType: template.sessionType,
        slotTypeStatus: 'Available',
        clinicianDisplayName: template.clinicianDisplayName,
        locationName: PRACTICE,
        locationAddress: PRACTICE_ADDRESS,
        locationPostcode: 'M1 2AB',
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      })
      slotIndex++
    }
  }

  return slots
}

export const mockSlotPool: AppointmentSlot[] = buildSlotPool()

/** Simulates GET /patient/{patientId}/appointment-slot?start-date=&days-number= */
export function filterAppointmentSlots(
  startDate: string,
  daysNumber: number,
): AppointmentSlot[] {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + daysNumber)

  const bookedSlotTimes = new Set(
    mockAppointments
      .filter((a) => a.status === 'booked')
      .map((a) => a.startTime),
  )

  return mockSlotPool.filter((slot) => {
    const slotStart = new Date(slot.startTime)
    if (slotStart < start || slotStart >= end) return false
    if (bookedSlotTimes.has(slot.startTime)) return false
    return true
  })
}

const SLOT_FETCH_DELAY_MS = 700

export function fetchAppointmentSlotsSimulated(
  startDate: string,
  daysNumber: number,
): Promise<AppointmentSlot[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filterAppointmentSlots(startDate, daysNumber))
    }, SLOT_FETCH_DELAY_MS)
  })
}

/** @deprecated Use filterAppointmentSlots / fetchAppointmentSlotsSimulated */
export const mockAvailableSlots = mockSlotPool.slice(0, 4)
