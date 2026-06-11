/** GP-side order status from Convenet POST /prescription/status */
export type GpOrderStatus = 'requested' | 'approved' | 'rejected'

/** Repeat medication list item — GET /repeat-medication */
export interface Prescription {
  id: string
  medicineId: string
  medication: string
  dosage: string
  lastIssued: string
  nextDue: string
  quantity: string
  issueNumber: number
  canBeRequested: boolean
  /** GP order lifecycle status; undefined when available to order */
  gpOrderStatus?: GpOrderStatus
  /** From order response — used for status polling */
  prescriptionOrderId?: string
  orderRequestDate?: string
  orderPharmacyName?: string
  orderPharmacyOds?: string
  orderComment?: string
  /** User-reported collection — not from GP or pharmacy systems */
  manualCollectedAt?: string
  manualCollectedNote?: string
}

export interface PharmacyNomination {
  ods: string
  postcode: string
  name: string
  address: string
  isNominated?: boolean
}

export interface OrderPrescriptionParams {
  prescriptionId: string
  pharmacyOds: string
  pharmacyPostcode: string
  pharmacyName: string
  comment?: string
}

export function prescriptionDisplayStatus(rx: Prescription): {
  label: string
  variant: 'success' | 'warning' | 'info' | 'danger' | 'muted' | 'default'
} {
  if (rx.manualCollectedAt) {
    return { label: 'Collected (reported by you)', variant: 'muted' }
  }
  switch (rx.gpOrderStatus) {
    case 'requested':
      return { label: 'Requested — awaiting GP', variant: 'warning' }
    case 'approved':
      return { label: 'Approved by GP', variant: 'info' }
    case 'rejected':
      return { label: 'Rejected by GP', variant: 'danger' }
    default:
      return rx.canBeRequested
        ? { label: 'Available to order', variant: 'success' }
        : { label: 'Not available', variant: 'muted' }
  }
}

export function canOrderPrescription(rx: Prescription): boolean {
  return rx.canBeRequested && !rx.gpOrderStatus && !rx.manualCollectedAt
}

export function canMarkCollected(rx: Prescription): boolean {
  return rx.gpOrderStatus === 'approved' && !rx.manualCollectedAt
}
