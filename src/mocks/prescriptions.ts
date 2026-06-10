export type PrescriptionStatus = 'available' | 'ordered' | 'ready' | 'collected'

export interface Prescription {
  id: string
  /** Convenet: medicineId — required for POST /patient/{patientId}/prescription */
  medicineId: string
  medication: string
  dosage: string
  lastOrdered: string
  nextDue: string
  status: PrescriptionStatus
  quantity: string
  issueNumber: number
  canBeRequested: boolean
  pharmacy?: string
}

export const mockPrescriptions: Prescription[] = [
  {
    id: 'rx-001',
    medicineId: 'cnv-med-001',
    medication: 'Ramipril 5mg capsules',
    dosage: 'One daily',
    lastOrdered: '2025-05-01T00:00:00Z',
    nextDue: '2026-06-15T00:00:00Z',
    status: 'available',
    quantity: '28 capsules',
    issueNumber: 12,
    canBeRequested: true,
  },
  {
    id: 'rx-002',
    medicineId: 'cnv-med-002',
    medication: 'Atorvastatin 20mg tablets',
    dosage: 'One at night',
    lastOrdered: '2025-04-15T00:00:00Z',
    nextDue: '2026-06-20T00:00:00Z',
    status: 'available',
    quantity: '28 tablets',
    issueNumber: 10,
    canBeRequested: true,
  },
  {
    id: 'rx-003',
    medicineId: 'cnv-med-003',
    medication: 'Metformin 500mg tablets',
    dosage: 'Two daily with meals',
    lastOrdered: '2025-05-20T00:00:00Z',
    nextDue: '2026-07-01T00:00:00Z',
    status: 'available',
    quantity: '56 tablets',
    issueNumber: 8,
    canBeRequested: true,
  },
  {
    id: 'rx-004',
    medicineId: 'cnv-med-004',
    medication: 'Aspirin 75mg dispersible tablets',
    dosage: 'One daily',
    lastOrdered: '2025-03-10T00:00:00Z',
    nextDue: '2026-08-01T00:00:00Z',
    status: 'available',
    quantity: '28 tablets',
    issueNumber: 6,
    canBeRequested: true,
  },
]
