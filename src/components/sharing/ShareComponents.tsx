import { useState } from 'react'
import { ChevronRight, Share2 } from 'lucide-react'
import { AttorneyBadge } from './AttorneyBadge'
import type {
  AccessTier,
  ShareActivation,
  SharePermissionSet,
} from '../../types/health-sharing'
import {
  classifyActivationTier,
  shareActivationDetail,
  shareActivationSummary,
  summarizeShareAccessParts,
} from '../../types/health-sharing'

export function SharingConsentBox() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex gap-3">
        <Share2 className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-2 text-sm text-amber-900">
          <p className="font-medium">Before you share your health data</p>
          <ul className="list-disc pl-4 space-y-1 text-amber-800">
            <li>
              Shared data may include sensitive clinical information. Review your record
              before granting access.
            </li>
            <li>
              Recipients can only see the sections you select. You can revoke access at
              any time — revoked sharing is kept for audit, not deleted.
            </li>
            <li>
              LPA-linked sharing follows your registered attorney arrangements in ELM.
            </li>
            <li>
              Sharing is not suitable for emergency care — signpost recipients to NHS 111
              or 999 when urgent help is needed.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const tierStyles: Record<
  AccessTier,
  { label: string; fill: string; empty: string }
> = {
  none: { label: 'No access', fill: 'bg-gray-300', empty: 'bg-gray-100' },
  limited: { label: 'Limited', fill: 'bg-amber-400', empty: 'bg-gray-100' },
  more: { label: 'More', fill: 'bg-nhs-blue', empty: 'bg-gray-100' },
  full: { label: 'Full', fill: 'bg-green-500', empty: 'bg-gray-100' },
}

const tierFillCount: Record<AccessTier, number> = {
  none: 0,
  limited: 1,
  more: 2,
  full: 3,
}

function AccessTierIndicator({ tier }: { tier: AccessTier }) {
  const { label, fill, empty } = tierStyles[tier]
  const filled = tierFillCount[tier]

  return (
    <span
      className="inline-flex shrink-0 w-8 self-center"
      title={`${label} access`}
      aria-label={`${label} access`}
    >
      <span className="flex gap-0.5 w-full">
        {[1, 2, 3].map((segment) => (
          <span
            key={segment}
            className={`h-1 flex-1 rounded-full ${segment <= filled ? fill : empty}`}
          />
        ))}
      </span>
    </span>
  )
}

function ExpandableAccessLine({
  summary,
  detail,
  tier,
}: {
  summary: string
  detail: { label: string; value: string }[]
  tier: AccessTier
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 py-1 text-left text-gray-900 hover:text-nhs-blue transition-colors"
        aria-expanded={open}
      >
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}
        />
        <AccessTierIndicator tier={tier} />
        <span className="text-sm leading-snug flex-1 min-w-0">{summary}</span>
      </button>
      {open && (
        <ul className="pb-1.5 pl-6 ml-10 space-y-1 text-sm text-gray-600">
          {detail.map((row) => (
            <li key={row.label} className="flex justify-between gap-4">
              <span>{row.label}</span>
              <span
                className={`shrink-0 ${row.value === 'None' ? 'text-gray-400' : 'font-medium text-gray-900'}`}
              >
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ShareAccessSummaryBlock({
  permissions,
  activation,
  recipientName,
  recipientRelation,
  isAttorney,
  showRecipientHeader = true,
}: {
  permissions: SharePermissionSet
  activation: ShareActivation
  recipientName: string
  recipientRelation?: string
  isAttorney?: boolean
  showRecipientHeader?: boolean
}) {
  const parts = summarizeShareAccessParts(permissions)

  return (
    <div
      className={
        showRecipientHeader
          ? 'rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm space-y-3'
          : 'text-sm space-y-3'
      }
    >
      {showRecipientHeader && (
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <span className="text-gray-500">Sharing with </span>
            <span className="font-medium text-gray-900">{recipientName}</span>
            {recipientRelation && (
              <span className="text-gray-500"> ({recipientRelation})</span>
            )}
          </div>
          {isAttorney && <AttorneyBadge />}
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Access level
        </p>
        <div className="space-y-0">
          <ExpandableAccessLine
            summary={shareActivationSummary(activation)}
            detail={shareActivationDetail(activation)}
            tier={classifyActivationTier(activation)}
          />
          <ExpandableAccessLine
            summary={parts.appointmentsPrescriptions}
            detail={parts.appointmentsPrescriptionsDetail}
            tier={parts.appointmentsPrescriptionsTier}
          />
          <ExpandableAccessLine
            summary={parts.record}
            detail={parts.recordDetail}
            tier={parts.recordTier}
          />
        </div>
      </div>
    </div>
  )
}

export function ShareSummaryPanel({
  recipientName,
  recipientRelation,
  isAttorney,
  permissions,
  activation,
}: {
  recipientName: string
  recipientRelation: string
  isAttorney?: boolean
  permissions: SharePermissionSet
  activation: ShareActivation
}) {
  return (
    <ShareAccessSummaryBlock
      permissions={permissions}
      activation={activation}
      recipientName={recipientName}
      recipientRelation={recipientRelation}
      isAttorney={isAttorney}
    />
  )
}
