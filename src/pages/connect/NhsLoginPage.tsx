import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { PatientBanner } from '../../components/healthcare/PatientBanner'
import {
  ConnectStepHeader,
  LinkageKeyInfo,
} from '../../components/connect/ConnectComponents'
import { NhsLoginButton } from '../../components/connect/NhsLoginButton'
import { Button } from '../../components/shared/Button'
import type { GpCredentials } from '../../mocks/nhs-login'
import { mockGpCredentials } from '../../mocks/nhs-login'
import { useHealth } from '../../lib/health-context'

type Step = 'choose' | 'gp-details'

const emptyManualForm = {
  accountId: '',
  linkageKey: '',
  odsCode: '',
  surname: '',
  dateOfBirth: '',
  practiceName: '',
}

export function NhsLoginPage() {
  const navigate = useNavigate()
  const { connection, completeConnection, showToast } = useHealth()
  const [step, setStep] = useState<Step>('choose')
  const [loading, setLoading] = useState(false)
  const [manualForm, setManualForm] = useState(emptyManualForm)

  useEffect(() => {
    if (!connection.pending?.consentGiven) {
      navigate('/healthcare/connect/consent', { replace: true })
    }
  }, [connection.pending?.consentGiven, navigate])

  if (!connection.pending?.consentGiven) {
    return null
  }

  const finishSignIn = (credentials: GpCredentials) => {
    flushSync(() => {
      completeConnection(credentials)
    })
    showToast('Health records connected successfully!')
    navigate('/healthcare/connect/capabilities', { replace: true })
  }

  const handleNhsLoginComplete = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      finishSignIn(mockGpCredentials)
    }, 1500)
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const credentials: GpCredentials = {
      accountId: manualForm.accountId,
      odsCode: manualForm.odsCode,
      linkageKey: manualForm.linkageKey,
      practiceName: manualForm.practiceName || 'Your GP practice',
    }
    finishSignIn(credentials)
  }

  if (step === 'choose') {
    return (
      <AppShell>
        <ConnectStepHeader
          step={3}
          total={4}
          title="Sign in to NHS England GP records"
          backTo="/healthcare/connect/consent"
        />
        <PatientBanner />

        <div className="max-w-lg">
          <p className="text-sm text-gray-500 mb-6">
            Connecting to <strong>{connection.pending?.sourceName}</strong>
          </p>

          <p className="text-base text-gray-700 mb-8">How would you like to sign in?</p>

          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                I already have or want to sign up for NHS login
              </p>
              <p className="text-sm text-gray-500 mb-4">
                NHS login allows you to access your health and care websites and apps with one
                set of login details. We will check if you have an NHS login. If not, you can
                set one up.
              </p>
              <NhsLoginButton onClick={handleNhsLoginComplete} loading={loading} />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-3 text-gray-500">or</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setStep('gp-details')}
                className="nhslogin-button-secondary"
              >
                I have details from my GP
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Enter your GP Online account ID, linkage key, and practice ODS code
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <ConnectStepHeader
        step={3}
        total={4}
        title="Sign in to NHS England GP records"
        backTo="/healthcare/connect/consent"
      />
      <PatientBanner />

      <div className="max-w-lg">
        <LinkageKeyInfo
          onHelp={() =>
            showToast('GP record access guide — help content coming soon in full platform')
          }
        />

        <form
          onSubmit={handleManualSubmit}
          className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <div>
            <label htmlFor="accountId" className="text-sm font-medium text-gray-700">
              Account ID
            </label>
            <input
              id="accountId"
              required
              value={manualForm.accountId}
              onChange={(e) => setManualForm((f) => ({ ...f, accountId: e.target.value }))}
              placeholder="e.g. 4829173"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-nhs-blue focus:border-nhs-blue"
            />
          </div>
          <div>
            <label htmlFor="linkageKey" className="text-sm font-medium text-gray-700">
              Linkage key
            </label>
            <input
              id="linkageKey"
              required
              value={manualForm.linkageKey}
              onChange={(e) => setManualForm((f) => ({ ...f, linkageKey: e.target.value }))}
              placeholder="Provided by your GP practice"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-nhs-blue focus:border-nhs-blue"
            />
          </div>
          <div>
            <label htmlFor="odsCode" className="text-sm font-medium text-gray-700">
              Practice ODS code
            </label>
            <input
              id="odsCode"
              required
              value={manualForm.odsCode}
              onChange={(e) => setManualForm((f) => ({ ...f, odsCode: e.target.value }))}
              placeholder="e.g. G85647"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-nhs-blue focus:border-nhs-blue"
            />
          </div>
          <div>
            <label htmlFor="surname" className="text-sm font-medium text-gray-700">
              Surname
            </label>
            <input
              id="surname"
              required
              value={manualForm.surname}
              onChange={(e) => setManualForm((f) => ({ ...f, surname: e.target.value }))}
              placeholder="As registered with your GP"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-nhs-blue focus:border-nhs-blue"
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              required
              value={manualForm.dateOfBirth}
              onChange={(e) => setManualForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-nhs-blue focus:border-nhs-blue"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setStep('choose')}>
              Back
            </Button>
            <Button type="submit" variant="nhs">
              Continue
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
