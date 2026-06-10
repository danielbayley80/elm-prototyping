import { Calendar, Check, FileText, Pill, X } from 'lucide-react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { PatientBanner } from '../../components/healthcare/PatientBanner'
import { ConnectStepHeader } from '../../components/connect/ConnectComponents'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/shared/Button'
import { useHealth } from '../../lib/health-context'
import { isConnected } from '../../types/health-connection'
import {
  isServiceAvailable,
  medicalRecordSectionLabels,
  type MedicalRecordSections,
} from '../../types/source-capabilities'

export function SourceCapabilitiesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sourceId } = useParams()
  const { connection, showToast, markSourcesSynced } = useHealth()

  const onboarding = location.pathname.includes('/healthcare/connect/capabilities')
  const source = onboarding
    ? connection.connectedSources[connection.connectedSources.length - 1]
    : connection.connectedSources.find((s) => s.id === sourceId)

  if (!isConnected(connection) || !source?.capabilities) {
    navigate(onboarding ? '/healthcare/connect' : '/healthcare/sources', { replace: true })
    return null
  }

  const caps = source.capabilities

  const handleContinue = () => {
    markSourcesSynced()
    showToast('Your health records are being loaded in the background')
    navigate('/healthcare', { replace: true })
  }

  const content = (
    <div className="max-w-2xl space-y-6">
      <p className="text-sm text-gray-600">
        Your GP practice controls which online services are available to you. ELM can only
        show features your practice has switched on for your account.
      </p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        <CapabilityRow
          icon={Calendar}
          label="Appointments"
          enabled={isServiceAvailable(
            caps.appointmentsEnabled,
            caps.practiceAppointmentsSupported,
          )}
          disabledReason={
            !caps.practiceAppointmentsSupported
              ? 'Your practice does not support online appointments'
              : !caps.appointmentsEnabled
                ? 'Appointments are not enabled for your account'
                : undefined
          }
        />
        <CapabilityRow
          icon={Pill}
          label="Repeat prescriptions"
          enabled={isServiceAvailable(
            caps.repeatPrescriptionsEnabled,
            caps.practiceRepeatPrescriptionsSupported,
          )}
          disabledReason={
            !caps.practiceRepeatPrescriptionsSupported
              ? 'Your practice does not support online repeat prescriptions'
              : !caps.repeatPrescriptionsEnabled
                ? 'Repeat prescriptions are not enabled for your account'
                : undefined
          }
        />
        <CapabilityRow
          icon={FileText}
          label="Medical record"
          enabled={isServiceAvailable(
            caps.medicalRecordEnabled,
            caps.practiceMedicalRecordSupported,
          )}
          disabledReason={
            !caps.practiceMedicalRecordSupported
              ? 'Your practice does not support online record access'
              : !caps.medicalRecordEnabled
                ? 'Medical record access is not enabled for your account'
                : undefined
          }
        />
      </div>

      {caps.medicalRecordEnabled && caps.practiceMedicalRecordSupported && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Record sections</h3>
          <p className="text-sm text-gray-500 mb-4">
            Sections your GP has made available in your online record.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(medicalRecordSectionLabels) as (keyof MedicalRecordSections)[]).map(
              (key) => (
                <li
                  key={key}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  {caps.medicalRecord[key] ? (
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                  ) : (
                    <X className="h-4 w-4 text-gray-300 shrink-0" />
                  )}
                  {medicalRecordSectionLabels[key]}
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        {onboarding ? (
          <Button variant="nhs" onClick={handleContinue}>
            Continue to my dashboard
          </Button>
        ) : (
          <Link to="/healthcare/sources">
            <Button variant="outline">Back to connected sources</Button>
          </Link>
        )}
      </div>
    </div>
  )

  if (onboarding) {
    return (
      <AppShell>
        <ConnectStepHeader
          step={4}
          total={4}
          title="Your GP services"
          backTo="/healthcare/connect/nhs"
        />
        <PatientBanner />
        {content}
      </AppShell>
    )
  }

  return (
    <AppShell>
      <PageHeader
        title="GP services"
        description={`Online services enabled for ${source.name}`}
      />
      <PatientBanner />
      {content}
    </AppShell>
  )
}

function CapabilityRow({
  icon: Icon,
  label,
  enabled,
  disabledReason,
}: {
  icon: typeof Calendar
  label: string
  enabled: boolean
  disabledReason?: string
}) {
  return (
    <div className="p-5 flex items-start gap-4">
      <div className={`p-2 rounded-lg shrink-0 ${enabled ? 'bg-green-50' : 'bg-gray-50'}`}>
        <Icon className={`h-5 w-5 ${enabled ? 'text-green-600' : 'text-gray-400'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{label}</span>
          {enabled ? (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Available
            </span>
          ) : (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              Not available
            </span>
          )}
        </div>
        {disabledReason && (
          <p className="text-sm text-gray-500 mt-1">{disabledReason}</p>
        )}
      </div>
    </div>
  )
}
