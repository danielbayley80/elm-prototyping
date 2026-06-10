import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { PatientBanner } from '../../components/healthcare/PatientBanner'
import { ConnectStepHeader } from '../../components/connect/ConnectComponents'
import {
  ShareSummaryPanel,
  SharingConsentBox,
} from '../../components/sharing/ShareComponents'
import { Button } from '../../components/shared/Button'
import { Checkbox } from '../../components/shared/Checkbox'
import { useHealth } from '../../lib/health-context'
import { isEditingPendingShare } from '../../types/health-sharing'

function PolicyLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-nhs-blue hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  )
}

export function AddShareConsentPage() {
  const navigate = useNavigate()
  const { pendingShare, completeShare, cancelPendingShare } = useHealth()
  const [understood, setUnderstood] = useState(false)
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    if (!pendingShare) {
      navigate('/healthcare/sharing/add', { replace: true })
    }
  }, [pendingShare, navigate])

  if (!pendingShare) return null

  const editing = isEditingPendingShare(pendingShare)
  const canConfirm = understood && consent

  const handleConfirm = () => {
    completeShare()
    navigate('/healthcare/sharing')
  }

  const handleDecline = () => {
    cancelPendingShare()
    navigate('/healthcare/sharing')
  }

  return (
    <AppShell>
      <ConnectStepHeader
        step={editing ? 3 : 4}
        total={editing ? 3 : 4}
        title={editing ? 'Confirm access changes' : 'Consent to share your health data'}
        backTo="/healthcare/sharing/add/terms"
      />
      <PatientBanner />

      <div className="max-w-2xl space-y-6">
        <SharingConsentBox />

        <ShareSummaryPanel
          recipientName={pendingShare.recipientName}
          recipientRelation={pendingShare.recipientRelation}
          isAttorney={pendingShare.isAttorney}
          permissions={pendingShare.permissions}
          activation={pendingShare.activation}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <p className="text-sm text-gray-700">
            {editing
              ? 'Please confirm you understand and consent to these updated access permissions.'
              : 'Please confirm you understand and consent to this sharing arrangement.'}
          </p>

          <div className="space-y-4">
            <Checkbox
              id="share-understood"
              checked={understood}
              onChange={setUnderstood}
              label="I understand what health data will be shared and who will be able to access it"
            />
            <Checkbox
              id="share-consent"
              checked={consent}
              onChange={setConsent}
              label={
                <>
                  I consent to ELM sharing my health data with{' '}
                  {pendingShare.recipientName} on the terms above, as described in the{' '}
                  <PolicyLink href="/legal/terms-of-service">Terms of Service</PolicyLink>{' '}
                  and <PolicyLink href="/legal/privacy-policy">Privacy Policy</PolicyLink>
                </>
              }
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleDecline}>
              Decline
            </Button>
            <Button variant="nhs" disabled={!canConfirm} onClick={handleConfirm}>
              {editing ? 'Save changes' : 'Confirm sharing'}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
