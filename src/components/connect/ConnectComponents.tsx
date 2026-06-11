import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, CircleHelp, Database, Shield } from 'lucide-react'
import type { HealthSource } from '../../mocks/health-sources'
import { Badge } from '../shared/Badge'

interface SourceCardProps {
  source: HealthSource
  onSelect: (source: HealthSource) => void
  onUnavailable: (source: HealthSource) => void
}

export function SourceCard({ source, onSelect, onUnavailable }: SourceCardProps) {
  const Icon = source.icon

  const handleClick = () => {
    if (source.available) {
      onSelect(source)
    } else {
      onUnavailable(source)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left bg-white rounded-xl border p-5 transition-all ${
        source.available
          ? 'border-gray-200 hover:border-nhs-blue hover:shadow-md cursor-pointer'
          : 'border-gray-100 opacity-75 cursor-default'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-lg ${source.available ? 'bg-blue-50' : 'bg-gray-50'}`}
        >
          <Icon
            className={`h-6 w-6 ${source.available ? 'text-nhs-blue' : 'text-gray-400'}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{source.name}</h3>
            {source.available ? (
              <Badge variant="success">Available</Badge>
            ) : (
              <Badge variant="muted">Coming soon</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{source.description}</p>
          <div className="text-xs text-gray-400 mt-2">{source.region}</div>
        </div>
        {source.available && (
          <ChevronRight className="h-5 w-5 text-gray-400 shrink-0 mt-1" />
        )}
      </div>
    </button>
  )
}

export function ConnectStepHeader({
  step,
  total,
  title,
  backTo,
}: {
  step: number
  total: number
  title: string
  backTo: string
}) {
  return (
    <div className="mb-6">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <div className="text-xs text-gray-400 mb-1">
        Step {step} of {total}
      </div>
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
    </div>
  )
}

export function SafetyWarningBox() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-900">Important health record information</h3>
          <p className="mt-2 text-sm text-amber-800">
            ELM is intended as a <strong className="font-medium text-amber-900">personal record</strong>{' '}
            for your own information and life management. It is{' '}
            <strong className="font-medium text-amber-900">not intended for use by healthcare
            professionals</strong>{' '}
            and does not replace your GP record, clinical systems, or advice from a qualified
            healthcare professional.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-800 list-disc list-outside pl-5">
            <li>
              Your GP record may contain information you have forgotten or were not told about
            </li>
            <li>
              This may include sensitive topics such as mental health, sexual health, substance
              use, terminal diagnoses, or family history
            </li>
            <li>
              Records may use clinical and technical terminology that can be difficult to
              understand without medical training
            </li>
            <li>
              This is your GP record only and may be a subset of what is available — depending
              on what your GP practice has made available online
            </li>
            <li>
              You may wish to connect your records in private before sharing access with
              attorneys, carers, or other authorised users
            </li>
            <li>
              If you have any questions or concerns about the contents of your record or your
              health, please speak to a qualified healthcare professional
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export function DataProcessingBox() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start gap-3">
        <Database className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900">Data processing and storage</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc list-outside pl-5">
            <li>
              By connecting your health record you give permission for ELM to securely process
              and store your data.
            </li>
            <li>
              <strong className="font-medium text-slate-900">
                Your data is not shared or processed
              </strong>{' '}
              with any third party without your explicit consent. You control who can see your
              health information through ELM's role-based access settings.
            </li>
            <li>
              Prior to sharing your data we recommend you fully review the content of your
              record and what will be shared.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export function LinkageKeyInfo({ onHelp }: { onHelp?: () => void }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 flex items-start gap-3">
      <CircleHelp className="h-5 w-5 text-nhs-blue shrink-0 mt-0.5" />
      <div className="text-sm text-blue-900 flex-1">
        <p>
          If you do not have these details you can request them from your GP. For more details
          and a general guide to accessing your GP record, click the help button.
        </p>
        <button
          type="button"
          onClick={onHelp}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-nhs-blue bg-white px-3 py-1.5 text-sm font-medium text-nhs-blue hover:bg-blue-50 transition-colors"
        >
          <CircleHelp className="h-4 w-4" />
          Help
        </button>
      </div>
    </div>
  )
}
