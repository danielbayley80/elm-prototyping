import { useEffect, useState } from 'react'
import { Modal } from '../shared/Modal'
import { Button } from '../shared/Button'
import { mockPharmacies } from '../../mocks/prescriptions'
import type { OrderPrescriptionParams, Prescription } from '../../types/prescription'
import type { AppointmentBookingReasonRequirement } from '../../types/source-capabilities'

interface OrderPrescriptionModalProps {
  open: boolean
  prescription: Prescription | null
  onClose: () => void
  onOrder: (params: OrderPrescriptionParams) => void
  commentRequirement: AppointmentBookingReasonRequirement
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
}

export function OrderPrescriptionModal({
  open,
  prescription,
  onClose,
  onOrder,
  commentRequirement,
}: OrderPrescriptionModalProps) {
  const nominated = mockPharmacies.find((p) => p.isNominated) ?? mockPharmacies[0]
  const [selectedPharmacyOds, setSelectedPharmacyOds] = useState(nominated.ods)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (!open) return
    setSelectedPharmacyOds(nominated.ods)
    setComment('')
  }, [open, prescription?.id, nominated.ods])

  if (!prescription) return null

  const commentRequired = commentRequirement === 'required'
  const commentOptional = commentRequirement === 'optional'
  const showComment = commentRequired || commentOptional
  const selectedPharmacy =
    mockPharmacies.find((p) => p.ods === selectedPharmacyOds) ?? nominated

  const canSubmit =
    !!selectedPharmacy && (!commentRequired || !!comment.trim())

  const handleSubmit = () => {
    if (!canSubmit) return
    onOrder({
      prescriptionId: prescription.id,
      pharmacyOds: selectedPharmacy.ods,
      pharmacyPostcode: selectedPharmacy.postcode,
      pharmacyName: selectedPharmacy.name,
      comment: comment.trim() || undefined,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Order repeat prescription">
      <div className="bg-gray-50 rounded-lg border border-gray-100 p-3 text-sm mb-4">
        <div className="font-medium text-gray-900">{prescription.medication}</div>
        <div className="text-gray-600 mt-1">{prescription.dosage}</div>
        <div className="text-gray-500 text-xs mt-1">
          {prescription.quantity} · Issue {prescription.issueNumber}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Choose where you would like to collect your prescription. Your nominated pharmacy
        is selected by default.
      </p>

      <div className="space-y-2 mb-4">
        <FieldLabel>Nominated pharmacy</FieldLabel>
        {mockPharmacies.map((pharmacy) => (
          <label
            key={pharmacy.ods}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedPharmacyOds === pharmacy.ods
                ? 'border-nhs-blue bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="pharmacy"
              value={pharmacy.ods}
              checked={selectedPharmacyOds === pharmacy.ods}
              onChange={() => setSelectedPharmacyOds(pharmacy.ods)}
              className="mt-1 text-nhs-blue focus:ring-nhs-blue"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 flex items-center gap-2 flex-wrap">
                {pharmacy.name}
                {pharmacy.isNominated && (
                  <span className="text-xs font-normal text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
                    Your nominated pharmacy
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{pharmacy.address}</div>
            </div>
          </label>
        ))}
      </div>

      {showComment && (
        <div className="mb-6">
          <FieldLabel>
            Comment for your GP
            {commentRequired ? ' (required)' : ' (optional)'}
          </FieldLabel>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 150))}
            rows={3}
            maxLength={150}
            placeholder="e.g. Running low, please approve repeat"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-nhs-blue focus:ring-1 focus:ring-nhs-blue"
          />
          <div className="text-xs text-gray-400 mt-1 text-right">{comment.length}/150</div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="nhs" disabled={!canSubmit} onClick={handleSubmit}>
          Confirm order
        </Button>
      </div>
    </Modal>
  )
}
