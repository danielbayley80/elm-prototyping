export interface MedicalRecordSections {
  allergies: boolean
  testResults: boolean
  immunisations: boolean
  documents: boolean
  medication: boolean
  consultations: boolean
  problems: boolean
}

export type AppointmentBookingReasonRequirement = 'notRequested' | 'required' | 'optional'

export interface PracticeInputRequirements {
  appointmentBookingReason: AppointmentBookingReasonRequirement
  prescribingComment: 'notRequested' | 'required' | 'optional'
}

export interface SourceCapabilities {
  repeatPrescriptionsEnabled: boolean
  appointmentsEnabled: boolean
  medicalRecordEnabled: boolean
  medicalRecord: MedicalRecordSections
  practiceAppointmentsSupported: boolean
  practiceMedicalRecordSupported: boolean
  practiceRepeatPrescriptionsSupported: boolean
  inputRequirements: PracticeInputRequirements
}

export function isServiceAvailable(
  patientEnabled: boolean,
  practiceSupported: boolean,
): boolean {
  return patientEnabled && practiceSupported
}

export const medicalRecordSectionLabels: Record<keyof MedicalRecordSections, string> = {
  allergies: 'Allergies',
  testResults: 'Test results',
  immunisations: 'Immunisations',
  documents: 'Documents',
  medication: 'Medication',
  consultations: 'Consultations',
  problems: 'Problems and diagnoses',
}
