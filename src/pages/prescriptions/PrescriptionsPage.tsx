import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ExternalLink } from 'lucide-react'
import { HealthcarePage } from '../../components/layout/HealthcarePage'
import { OrderPrescriptionModal } from '../../components/prescriptions/OrderPrescriptionModal'
import { MarkCollectedModal } from '../../components/prescriptions/MarkCollectedModal'
import { Badge } from '../../components/shared/Badge'
import { Button } from '../../components/shared/Button'
import {
  getPrescriptionsAccess,
  getPrimarySourceCapabilities,
} from '../../lib/prescription-access'
import { useHealth } from '../../lib/health-context'
import type { Prescription } from '../../types/prescription'
import {
  canMarkCollected,
  canOrderPrescription,
  prescriptionDisplayStatus,
} from '../../types/prescription'
import { isConnected } from '../../types/health-connection'
import { formatDate, formatDateTime } from '../../lib/utils'

export function PrescriptionsPage() {
  const navigate = useNavigate()
  const { prescriptions, connection, orderPrescription, markPrescriptionCollected } =
    useHealth()
  const [orderTarget, setOrderTarget] = useState<Prescription | null>(null)
  const [collectTarget, setCollectTarget] = useState<Prescription | null>(null)

  if (!isConnected(connection)) {
    navigate('/healthcare', { replace: true })
    return null
  }

  const capabilities = getPrimarySourceCapabilities(connection.connectedSources)
  const access = getPrescriptionsAccess(capabilities)
  const commentRequirement =
    capabilities?.inputRequirements.prescribingComment ?? 'optional'

  const sorted = [...prescriptions].sort((a, b) => {
    const order = (rx: Prescription) => {
      if (canOrderPrescription(rx)) return 0
      if (rx.gpOrderStatus === 'requested') return 1
      if (rx.gpOrderStatus === 'approved' && !rx.manualCollectedAt) return 2
      return 3
    }
    return order(a) - order(b)
  })

  return (
    <HealthcarePage
      title="Prescriptions"
      description="View and order repeat prescriptions from your GP."
    >
      {!access.available && access.disabledReason && (
        <div className="mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          {access.disabledReason}
        </div>
      )}

      {access.available && (
        <div className="mb-6 text-sm text-blue-800 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p>
            ELM shows when your GP has approved a repeat request. To track when a
            prescription is ready to collect, use the NHS App.
          </p>
          <a
            href="https://www.nhs.uk/nhs-app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-nhs-blue font-medium shrink-0 hover:underline"
          >
            Open NHS App
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}

      {connection.syncPreferences.prescriptionsToCalendar && (
        <div className="mb-6 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
          <Calendar className="h-4 w-4" />
          Prescription due dates are added to your ELM calendar
        </div>
      )}

      {access.available && (
        <div className="space-y-3">
          {sorted.map((rx) => (
            <PrescriptionCard
              key={rx.id}
              prescription={rx}
              canOrder={access.canOrder}
              onOrder={() => setOrderTarget(rx)}
              onMarkCollected={() => setCollectTarget(rx)}
            />
          ))}
        </div>
      )}

      <OrderPrescriptionModal
        open={!!orderTarget}
        prescription={orderTarget}
        onClose={() => setOrderTarget(null)}
        onOrder={(params) => {
          orderPrescription(params)
          setOrderTarget(null)
        }}
        commentRequirement={commentRequirement}
      />

      <MarkCollectedModal
        open={!!collectTarget}
        prescription={collectTarget}
        onClose={() => setCollectTarget(null)}
        onConfirm={(note) => {
          if (collectTarget) markPrescriptionCollected(collectTarget.id, note)
          setCollectTarget(null)
        }}
      />
    </HealthcarePage>
  )
}

function PrescriptionCard({
  prescription: rx,
  canOrder,
  onOrder,
  onMarkCollected,
}: {
  prescription: Prescription
  canOrder: boolean
  onOrder: () => void
  onMarkCollected: () => void
}) {
  const status = prescriptionDisplayStatus(rx)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900">{rx.medication}</span>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <div className="text-sm text-gray-500 mt-1">{rx.dosage}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 text-sm">
          <div>
            <span className="text-xs text-gray-400 block">Last issued</span>
            {formatDate(rx.lastIssued)}
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Next due</span>
            {formatDate(rx.nextDue)}
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Quantity</span>
            {rx.quantity}
          </div>
        </div>
        {rx.orderPharmacyName && rx.gpOrderStatus && (
          <div className="text-xs text-gray-500 mt-2">
            Collect from {rx.orderPharmacyName}
            {rx.orderRequestDate && (
              <> · Ordered {formatDateTime(rx.orderRequestDate)}</>
            )}
          </div>
        )}
        {rx.manualCollectedAt && (
          <div className="text-xs text-gray-500 mt-1">
            Marked collected {formatDateTime(rx.manualCollectedAt)}
            {rx.manualCollectedNote ? ` — ${rx.manualCollectedNote}` : ''}
          </div>
        )}
        {rx.gpOrderStatus === 'rejected' && rx.orderComment && (
          <div className="text-xs text-red-600 mt-1">Your comment: {rx.orderComment}</div>
        )}
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        {canOrder && canOrderPrescription(rx) && (
          <Button variant="nhs" size="sm" onClick={onOrder}>
            Order repeat
          </Button>
        )}
        {canMarkCollected(rx) && (
          <Button variant="outline" size="sm" onClick={onMarkCollected}>
            Mark as collected
          </Button>
        )}
      </div>
    </div>
  )
}
