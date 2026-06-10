import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, History } from 'lucide-react'
import { AttorneyBadge } from '../sharing/AttorneyBadge'
import { ShareAccessSummaryBlock } from '../sharing/ShareComponents'
import { Badge } from '../shared/Badge'
import { Button } from '../shared/Button'
import { formatDate, formatDateTime } from '../../lib/utils'
import type { HealthShare } from '../../types/health-sharing'
import {
  effectiveShareStatus,
  shareStatusLabel,
  shareStatusVariant,
} from '../../types/health-sharing'
import { RevokeShareModal } from './RevokeShareModal'

interface ShareGrantCardProps {
  share: HealthShare
  lpaHealthWelfareActive: boolean
  onEdit: (shareId: string) => void
  onRevoke: (shareId: string) => void
}

export function ShareGrantCard({
  share,
  lpaHealthWelfareActive,
  onEdit,
  onRevoke,
}: ShareGrantCardProps) {
  const navigate = useNavigate()
  const [showLog, setShowLog] = useState(false)
  const [revokeOpen, setRevokeOpen] = useState(false)

  const effectiveStatus = effectiveShareStatus(share, lpaHealthWelfareActive)
  const canManage = effectiveStatus === 'active' || effectiveStatus === 'pending_lpa'

  const handleEdit = () => {
    onEdit(share.id)
    navigate('/healthcare/sharing/add/scope')
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative">
        <div className={canManage ? 'pr-32 sm:pr-36' : undefined}>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{share.recipientName}</h3>
            {share.isAttorney && <AttorneyBadge />}
            <Badge variant={shareStatusVariant(effectiveStatus)}>
              {shareStatusLabel(effectiveStatus)}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{share.recipientRelation}</p>

          <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-gray-500 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Last accessed
              </dt>
              <dd className="font-medium text-gray-900 mt-0.5">
                {share.lastAccessedAt
                  ? formatDateTime(share.lastAccessedAt)
                  : 'Not yet accessed'}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Sharing since</dt>
              <dd className="font-medium text-gray-900 mt-0.5">
                {formatDate(share.consentRecordedAt)}
              </dd>
            </div>
          </dl>
        </div>

        {canManage && (
          <div className="absolute top-5 right-5 flex flex-col gap-2">
            <Button variant="nhs" size="sm" onClick={handleEdit}>
              Edit access
            </Button>
            <Button variant="outline" size="sm" onClick={() => setRevokeOpen(true)}>
              Revoke access
            </Button>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <ShareAccessSummaryBlock
            permissions={share.permissions}
            activation={share.activation}
            recipientName={share.recipientName}
            showRecipientHeader={false}
          />
        </div>

        {share.status === 'revoked' && share.revokedAt && (
          <p className="mt-3 text-sm text-gray-500">
            Revoked on {formatDateTime(share.revokedAt)} — kept for audit purposes
          </p>
        )}

        {share.accessLog.length > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowLog((v) => !v)}
              className="inline-flex items-center gap-1.5 text-sm text-nhs-blue hover:underline"
            >
              <History className="h-4 w-4" />
              {showLog ? 'Hide access history' : 'View access history'}
            </button>
            {showLog && (
              <ul className="mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                {share.accessLog.map((event) => (
                  <li key={event.id} className="text-sm">
                    <span className="text-gray-900">{formatDateTime(event.accessedAt)}</span>
                    {event.note && (
                      <span className="text-gray-500"> — {event.note}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <RevokeShareModal
        share={share}
        open={revokeOpen}
        onClose={() => setRevokeOpen(false)}
        onConfirm={() => {
          onRevoke(share.id)
          setRevokeOpen(false)
        }}
      />
    </>
  )
}
