import { Calendar } from 'lucide-react'
import { HealthcarePage } from '../../components/layout/HealthcarePage'
import { Button } from '../../components/shared/Button'
import { StatusBadge } from '../../components/shared/Badge'
import { useHealth } from '../../lib/health-context'
import { formatDate } from '../../lib/utils'

export function PrescriptionsPage() {
  const { prescriptions, connection, orderPrescription } = useHealth()

  return (
    <HealthcarePage
      title="Prescriptions"
      description="Order repeat prescriptions directly with your GP."
    >

      {connection.syncPreferences.prescriptionsToCalendar && (
        <div className="mb-6 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
          <Calendar className="h-4 w-4" />
          Prescription due dates are added to your ELM calendar
        </div>
      )}


      <div className="space-y-3">
        {prescriptions.map((rx) => (
          <div
            key={rx.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-900">{rx.medication}</span>
                <StatusBadge status={rx.status} />
              </div>
              <div className="text-sm text-gray-500 mt-1">{rx.dosage}</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block">Last ordered</span>
                  {formatDate(rx.lastOrdered)}
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
            </div>
            {rx.status === 'available' && rx.canBeRequested && (
              <Button variant="nhs" size="sm" onClick={() => orderPrescription(rx.id)}>
                Order repeat
              </Button>
            )}
            {rx.status === 'ordered' && (
              <span className="text-sm text-amber-600 font-medium">Ordered — awaiting GP approval</span>
            )}
          </div>
        ))}
      </div>
    </HealthcarePage>
  )
}
