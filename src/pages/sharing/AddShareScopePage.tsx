import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { PatientBanner } from '../../components/healthcare/PatientBanner'
import { ConnectStepHeader } from '../../components/connect/ConnectComponents'
import { ShareScopeForm } from '../../components/sharing/ShareScopeForm'
import { Button } from '../../components/shared/Button'
import { useHealth } from '../../lib/health-context'
import { hasAnySharePermission, isEditingPendingShare } from '../../types/health-sharing'

export function AddShareScopePage() {
  const navigate = useNavigate()
  const { pendingShare, updatePendingShare } = useHealth()

  useEffect(() => {
    if (!pendingShare) {
      navigate('/healthcare/sharing/add', { replace: true })
    }
  }, [pendingShare, navigate])

  if (!pendingShare) return null

  const editing = isEditingPendingShare(pendingShare)
  const canProceed = hasAnySharePermission(pendingShare.permissions)

  return (
    <AppShell>
      <ConnectStepHeader
        step={editing ? 1 : 2}
        total={editing ? 3 : 4}
        title={editing ? 'Edit access permissions' : 'What would you like to share?'}
        backTo={editing ? '/healthcare/sharing' : '/healthcare/sharing/add'}
      />
      <PatientBanner />

      <div className="max-w-2xl space-y-6">
        <ShareScopeForm
          permissions={pendingShare.permissions}
          onChange={(permissions) => updatePendingShare({ permissions })}
          recipientName={pendingShare.recipientName}
        />

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(editing ? '/healthcare/sharing' : '/healthcare/sharing/add')}
          >
            Back
          </Button>
          <Button
            variant="nhs"
            disabled={!canProceed}
            onClick={() => navigate('/healthcare/sharing/add/terms')}
          >
            Continue
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
