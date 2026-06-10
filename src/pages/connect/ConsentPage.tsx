import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { PatientBanner } from '../../components/healthcare/PatientBanner'
import {
  ConnectStepHeader,
  DataProcessingBox,
  SafetyWarningBox,
} from '../../components/connect/ConnectComponents'
import { Button } from '../../components/shared/Button'
import { Checkbox } from '../../components/shared/Checkbox'
import { useHealth } from '../../lib/health-context'

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

export function ConsentPage() {
  const navigate = useNavigate()
  const { connection, giveConsent } = useHealth()
  const [dataConsent, setDataConsent] = useState(false)
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false)

  const canProceed = dataConsent && safetyAcknowledged

  useEffect(() => {
    if (!connection.pending) {
      navigate('/healthcare/connect', { replace: true })
    }
  }, [connection.pending, navigate])

  if (!connection.pending) {
    return null
  }

  const handleAccept = () => {
    giveConsent()
    navigate('/healthcare/connect/nhs')
  }

  return (
    <AppShell>
      <ConnectStepHeader
        step={2}
        total={4}
        title="Consent to connect your health records"
        backTo="/healthcare/connect"
      />
      <PatientBanner />

      <div className="max-w-2xl space-y-6">
        <SafetyWarningBox />

        <DataProcessingBox />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <p className="text-sm text-gray-700">
            Before we connect your records, please confirm the following.
          </p>

          <div className="space-y-4">
            <Checkbox
              id="safety"
              checked={safetyAcknowledged}
              onChange={setSafetyAcknowledged}
              label="I have read and understand the important health record information about what may be contained in my medical record"
            />
            <Checkbox
              id="data-consent"
              checked={dataConsent}
              onChange={setDataConsent}
              label={
                <>
                  I consent to ELM storing and processing my health data to provide the Life
                  Management service, as described in the{' '}
                  <PolicyLink href="/legal/terms-of-service">Terms of Service</PolicyLink> and{' '}
                  <PolicyLink href="/legal/privacy-policy">Privacy Policy</PolicyLink>.
                </>
              }
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => navigate('/healthcare/connect')}>
              Decline
            </Button>
            <Button variant="nhs" disabled={!canProceed} onClick={handleAccept}>
              Accept and continue
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
