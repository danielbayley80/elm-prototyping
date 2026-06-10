import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { PatientBanner } from '../../components/healthcare/PatientBanner'
import { ConnectStepHeader } from '../../components/connect/ConnectComponents'
import { Button } from '../../components/shared/Button'
import { useHealth } from '../../lib/health-context'
import type { ShareActivation } from '../../types/health-sharing'
import { isEditingPendingShare, shareActivationLabels } from '../../types/health-sharing'

function activationOptionsFor(recipientName: string): {
  value: ShareActivation
  title: string
  description: string
}[] {
  return [
    {
      value: 'always',
      title: shareActivationLabels.always,
      description: `${recipientName} will be invited now and will have immediate access.`,
    },
    {
      value: 'lpa_gated',
      title: shareActivationLabels.lpa_gated,
      description: `${recipientName} will be invited now, but will only have access when your LPA is activated.`,
    },
  ]
}

export function AddShareTermsPage() {
  const navigate = useNavigate()
  const { pendingShare, updatePendingShare, lpaHealthWelfareActive } = useHealth()

  useEffect(() => {
    if (!pendingShare) {
      navigate('/healthcare/sharing/add', { replace: true })
    }
  }, [pendingShare, navigate])

  if (!pendingShare) return null

  const editing = isEditingPendingShare(pendingShare)

  return (
    <AppShell>
      <ConnectStepHeader
        step={editing ? 2 : 3}
        total={editing ? 3 : 4}
        title="When should access apply?"
        backTo="/healthcare/sharing/add/scope"
      />
      <PatientBanner />

      <div className="max-w-xl space-y-6">
        <p className="text-sm text-gray-600">
          Choose how the permissions you set relate to your LPA arrangements. Your LPA is
          currently{' '}
          <strong>{lpaHealthWelfareActive ? 'active' : 'not active'}</strong> in ELM.
        </p>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          {activationOptionsFor(pendingShare.recipientName).map((option) => (
            <label key={option.value} className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="activation"
                checked={pendingShare.activation === option.value}
                onChange={() =>
                  updatePendingShare({
                    activation: option.value,
                    lpaExpandedSections: [],
                  })
                }
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-900">{option.title}</div>
                <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/healthcare/sharing/add/scope')}
          >
            Back
          </Button>
          <Button variant="nhs" onClick={() => navigate('/healthcare/sharing/add/consent')}>
            Continue
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
