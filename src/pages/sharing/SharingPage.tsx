import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { HealthcarePage } from '../../components/layout/HealthcarePage'
import { ShareGrantCard } from '../../components/healthcare/ShareGrantCard'
import { Button } from '../../components/shared/Button'
import { useHealth } from '../../lib/health-context'
import { isConnected } from '../../types/health-connection'
import { effectiveShareStatus } from '../../types/health-sharing'

export function SharingPage() {
  const navigate = useNavigate()
  const { connection, shares, lpaHealthWelfareActive, revokeShare, startEditShare } = useHealth()

  if (!isConnected(connection)) {
    navigate('/healthcare', { replace: true })
    return null
  }

  const activeShares = shares.filter(
    (s) => effectiveShareStatus(s, lpaHealthWelfareActive) !== 'revoked',
  )
  const revokedShares = shares.filter((s) => s.status === 'revoked')

  return (
    <HealthcarePage
      title="Health data sharing"
      description="See who can access your health data, under what terms, and when they last viewed it"
      action={
        <Button variant="nhs" size="sm" onClick={() => navigate('/healthcare/sharing/add')}>
          <Plus className="h-4 w-4" />
          Set up sharing
        </Button>
      }
    >

      {activeShares.length === 0 ? (
        <div className="max-w-xl bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-gray-600 mb-4">
            You have not set up any health data sharing yet.
          </p>
          <Button variant="nhs" onClick={() => navigate('/healthcare/sharing/add')}>
            Set up sharing
          </Button>
        </div>
      ) : (
        <section className="max-w-3xl space-y-4">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Active sharing
          </h2>
          {activeShares.map((share) => (
            <ShareGrantCard
              key={share.id}
              share={share}
              lpaHealthWelfareActive={lpaHealthWelfareActive}
              onEdit={startEditShare}
              onRevoke={revokeShare}
            />
          ))}
        </section>
      )}

      {revokedShares.length > 0 && (
        <section className="max-w-3xl mt-10 space-y-4">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Revoked sharing (audit history)
          </h2>
          <p className="text-sm text-gray-500">
            Revoked arrangements are kept for your records and are not deleted.
          </p>
          {revokedShares.map((share) => (
            <ShareGrantCard
              key={share.id}
              share={share}
              lpaHealthWelfareActive={lpaHealthWelfareActive}
              onEdit={startEditShare}
              onRevoke={revokeShare}
            />
          ))}
        </section>
      )}
    </HealthcarePage>
  )
}
