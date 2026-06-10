import { useNavigate } from 'react-router-dom'
import { ChevronRight, User } from 'lucide-react'
import { AppShell } from '../../components/layout/AppShell'
import { PatientBanner } from '../../components/healthcare/PatientBanner'
import { ConnectStepHeader } from '../../components/connect/ConnectComponents'
import { AttorneyBadge } from '../../components/sharing/AttorneyBadge'
import { mockShareRecipients } from '../../mocks/health-sharing'
import { useHealth } from '../../lib/health-context'
import { isConnected } from '../../types/health-connection'
import { effectiveShareStatus } from '../../types/health-sharing'
import { Badge } from '../../components/shared/Badge'

export function AddShareRecipientPage() {
  const navigate = useNavigate()
  const { connection, shares, lpaHealthWelfareActive, startShare } = useHealth()

  if (!isConnected(connection)) {
    navigate('/healthcare', { replace: true })
    return null
  }

  const activeRecipientIds = new Set(
    shares
      .filter((s) => effectiveShareStatus(s, lpaHealthWelfareActive) !== 'revoked')
      .map((s) => s.recipientId),
  )

  const recipients = mockShareRecipients.filter((r) => !activeRecipientIds.has(r.id))

  return (
    <AppShell>
      <ConnectStepHeader
        step={1}
        total={4}
        title="Who would you like to share with?"
        backTo="/healthcare/sharing"
      />
      <PatientBanner />

      <div className="max-w-xl space-y-3">
        <p className="text-sm text-gray-600 mb-4">
          Choose someone from your ELM contacts. People you already share with are not
          shown — revoke existing sharing first to change their access.
        </p>

        {recipients.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-600">
            Everyone in your contacts already has an active sharing arrangement. Revoke
            an existing share from the sharing page if you need to set up new terms.
          </div>
        ) : (
          recipients.map((recipient) => (
            <button
              key={recipient.id}
              type="button"
              onClick={() => {
                startShare(
                  recipient.id,
                  recipient.name,
                  recipient.relation,
                  recipient.isAttorney,
                )
                navigate('/healthcare/sharing/add/scope')
              }}
              className="w-full text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-nhs-blue hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-50">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{recipient.name}</h3>
                    {recipient.isAttorney && <AttorneyBadge />}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{recipient.relation}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 shrink-0 mt-1" />
              </div>
            </button>
          ))
        )}

        <div className="pt-2">
          <Badge variant="muted">Prototype — contacts from ELM platform</Badge>
        </div>
      </div>
    </AppShell>
  )
}
