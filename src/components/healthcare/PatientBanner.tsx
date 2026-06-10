import { formatDate } from '../../lib/utils'
import { patientProfile } from '../../lib/patient-details'

function BannerField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  )
}

export function PatientBanner() {
  return (
    <div
      className="mb-6 bg-white rounded-xl border border-gray-200 px-5 py-3"
      role="region"
      aria-label="Patient details"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Patient
          </div>
          <div className="text-lg font-semibold text-gray-900 leading-tight">
            {patientProfile.name}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 sm:justify-end sm:text-right">
          <BannerField label="Gender" value={patientProfile.gender} />
          <BannerField label="Date of birth" value={formatDate(patientProfile.dateOfBirth)} />
        </div>
      </div>
    </div>
  )
}
