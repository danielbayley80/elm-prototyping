import type { PharmacyNomination, Prescription } from '../types/prescription'

export type { PharmacyNomination, Prescription, OrderPrescriptionParams } from '../types/prescription'

export const mockPharmacies: PharmacyNomination[] = [
  {
    ods: 'FQW11',
    postcode: 'M1 1AD',
    name: 'Boots Manchester Piccadilly',
    address: '32 Piccadilly, Manchester M1 1AD',
    isNominated: true,
  },
  {
    ods: 'FED87',
    postcode: 'M3 4LB',
    name: 'Well Pharmacy — Deansgate',
    address: '78 Deansgate, Manchester M3 4LB',
  },
  {
    ods: 'FNV99',
    postcode: 'M20 4BX',
    name: 'Lloyds Pharmacy — Didsbury',
    address: '812 Wilmslow Road, Manchester M20 4BX',
  },
]

export const mockPrescriptions: Prescription[] = [
  {
    id: 'rx-001',
    medicineId: 'cnv-med-001',
    medication: 'Ramipril 5mg capsules',
    dosage: 'One daily',
    lastIssued: '2025-05-01T00:00:00Z',
    nextDue: '2026-06-15T00:00:00Z',
    quantity: '28 capsules',
    issueNumber: 12,
    canBeRequested: true,
  },
  {
    id: 'rx-002',
    medicineId: 'cnv-med-002',
    medication: 'Atorvastatin 20mg tablets',
    dosage: 'One at night',
    lastIssued: '2025-04-15T00:00:00Z',
    nextDue: '2026-06-20T00:00:00Z',
    quantity: '28 tablets',
    issueNumber: 10,
    canBeRequested: true,
    gpOrderStatus: 'requested',
    prescriptionOrderId: 'cnv-rx-ord-002',
    orderRequestDate: '2026-06-08T09:15:00Z',
    orderPharmacyName: 'Boots Manchester Piccadilly',
    orderPharmacyOds: 'FQW11',
  },
  {
    id: 'rx-003',
    medicineId: 'cnv-med-003',
    medication: 'Metformin 500mg tablets',
    dosage: 'Two daily with meals',
    lastIssued: '2025-05-20T00:00:00Z',
    nextDue: '2026-07-01T00:00:00Z',
    quantity: '56 tablets',
    issueNumber: 8,
    canBeRequested: true,
    gpOrderStatus: 'approved',
    prescriptionOrderId: 'cnv-rx-ord-003',
    orderRequestDate: '2026-06-05T11:30:00Z',
    orderPharmacyName: 'Boots Manchester Piccadilly',
    orderPharmacyOds: 'FQW11',
  },
  {
    id: 'rx-004',
    medicineId: 'cnv-med-004',
    medication: 'Aspirin 75mg dispersible tablets',
    dosage: 'One daily',
    lastIssued: '2025-03-10T00:00:00Z',
    nextDue: '2026-08-01T00:00:00Z',
    quantity: '28 tablets',
    issueNumber: 6,
    canBeRequested: true,
    gpOrderStatus: 'approved',
    prescriptionOrderId: 'cnv-rx-ord-004',
    orderRequestDate: '2026-05-28T14:00:00Z',
    orderPharmacyName: 'Boots Manchester Piccadilly',
    orderPharmacyOds: 'FQW11',
    manualCollectedAt: '2026-06-02T16:45:00Z',
    manualCollectedNote: 'Collected from pharmacy',
  },
  {
    id: 'rx-005',
    medicineId: 'cnv-med-005',
    medication: 'Bendroflumethiazide 2.5mg tablets',
    dosage: 'One daily in the morning',
    lastIssued: '2025-02-01T00:00:00Z',
    nextDue: '2026-09-01T00:00:00Z',
    quantity: '28 tablets',
    issueNumber: 4,
    canBeRequested: false,
    gpOrderStatus: 'rejected',
    prescriptionOrderId: 'cnv-rx-ord-005',
    orderRequestDate: '2026-05-15T10:00:00Z',
    orderPharmacyName: 'Boots Manchester Piccadilly',
    orderPharmacyOds: 'FQW11',
    orderComment: 'Running low — please review dosage',
  },
]

const STATUS_POLL_DELAY_MS = 2500

/** Simulates POST /prescription/status returning approved */
export function simulateGpStatusPoll(
  onUpdate: (prescriptionId: string, status: 'approved') => void,
  prescriptionId: string,
): () => void {
  const timer = setTimeout(() => {
    onUpdate(prescriptionId, 'approved')
  }, STATUS_POLL_DELAY_MS)
  return () => clearTimeout(timer)
}
