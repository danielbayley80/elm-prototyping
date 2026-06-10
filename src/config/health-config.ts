import type { MedicalType } from '../types/medical-type'

export const defaultMedicalType: MedicalType = {
  type: 'Unknown',
  label: 'Unknown type',
  icon: 'FileQuestion',
  color: '#CCCCCC',
  dateLabel: 'Date',
}

export const healthConfig: Record<string, MedicalType> = {
  MedicationStatement: {
    type: 'MedicationStatement',
    label: 'Medications',
    icon: 'Pill',
    color: '#4CAF50',
    dateLabel: 'Prescribed',
  },
  Immunization: {
    type: 'Immunization',
    label: 'Immunisations',
    icon: 'Syringe',
    color: '#FF9800',
    dateLabel: 'Administered',
  },
  MedicationRequest: {
    type: 'MedicationRequest',
    label: 'Prescriptions',
    icon: 'FileText',
    color: '#3F51B5',
    dateLabel: 'Prescribed',
  },
  Condition: {
    type: 'Condition',
    label: 'Conditions',
    icon: 'Stethoscope',
    color: '#F44336',
    dateLabel: 'Observed',
  },
  Observation: {
    type: 'Observation',
    label: 'Observations',
    icon: 'Eye',
    color: '#9C27B0',
    dateLabel: 'Observed',
  },
  AllergyIntolerance: {
    type: 'AllergyIntolerance',
    label: 'Allergies',
    icon: 'Ban',
    color: '#FF5722',
    dateLabel: 'Identified',
  },
  Encounter: {
    type: 'Encounter',
    label: 'Encounters',
    icon: 'Calendar',
    color: '#00BCD4',
    dateLabel: 'Date',
  },
  Procedure: {
    type: 'Procedure',
    label: 'Procedures',
    icon: 'Cross',
    color: '#8BC34A',
    dateLabel: 'Performed',
  },
  DiagnosticReport: {
    type: 'DiagnosticReport',
    label: 'Lab Results',
    icon: 'FlaskConical',
    color: '#2196F3',
    dateLabel: 'Reported',
  },
  ImagingStudy: {
    type: 'ImagingStudy',
    label: 'Imaging Studies',
    icon: 'Image',
    color: '#673AB7',
    dateLabel: 'Performed',
  },
  CarePlan: {
    type: 'CarePlan',
    label: 'Care Plans',
    icon: 'ClipboardList',
    color: '#795548',
    dateLabel: 'Created',
  },
  FamilyMemberHistory: {
    type: 'FamilyMemberHistory',
    label: 'Family History',
    icon: 'Users',
    color: '#607D8B',
    dateLabel: 'Updated',
  },
  Device: {
    type: 'Device',
    label: 'Devices',
    icon: 'Cpu',
    color: '#009688',
    dateLabel: 'Registered',
  },
}

export function getMedicalType(type: string): MedicalType {
  return healthConfig[type] ?? defaultMedicalType
}
