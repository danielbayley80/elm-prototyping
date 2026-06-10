export interface GpCredentials {
  accountId: string
  odsCode: string
  linkageKey: string
  practiceName: string
}

export const mockGpCredentials: GpCredentials = {
  accountId: '4829173',
  odsCode: 'G85647',
  linkageKey: '••••-••••-••••-4829',
  practiceName: 'Riverside Medical Centre, Manchester',
}

/** Returned by Convenet POST /patient after registration */
export const mockConvenetPatientId = '460a6d87-689c-4661-a526-a52450bbe2d7'

export const mockNhsLoginUser = {
  name: 'Margaret Thompson',
  surname: 'Thompson',
  nhsNumber: '943 476 5919',
  dateOfBirth: '1952-03-14',
  gender: 'Female',
  email: 'margaret.thompson@example.com',
}

/** Mock response from GET /patient/{patientId}/settings */
export const mockPatientSettings = {
  repeatPrescriptionsEnabled: true,
  appointmentsEnabled: true,
  medicalRecordEnabled: true,
  medicalRecord: {
    allergies: true,
    testResults: true,
    immunisations: true,
    documents: true,
    medication: true,
    consultations: true,
    problems: true,
  },
}

/** Mock response from GET /practice/{odsCode}/settings */
export const mockPracticeSettings = {
  services: {
    appointmentsSupported: 'yes' as const,
    medicalRecordSupported: 'yes' as const,
    repeatPrescriptionsSupported: 'yes' as const,
  },
}

export function buildMockSourceCapabilities(
  patient = mockPatientSettings,
  practice = mockPracticeSettings,
): import('../types/source-capabilities').SourceCapabilities {
  return {
    repeatPrescriptionsEnabled: patient.repeatPrescriptionsEnabled,
    appointmentsEnabled: patient.appointmentsEnabled,
    medicalRecordEnabled: patient.medicalRecordEnabled,
    medicalRecord: { ...patient.medicalRecord },
    practiceAppointmentsSupported: practice.services.appointmentsSupported === 'yes',
    practiceMedicalRecordSupported: practice.services.medicalRecordSupported === 'yes',
    practiceRepeatPrescriptionsSupported:
      practice.services.repeatPrescriptionsSupported === 'yes',
  }
}
