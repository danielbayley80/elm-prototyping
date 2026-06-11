import { getMedicalType } from '../../config/health-config'
import { getSourceSystem } from '../../config/source-config'
import { getIcon } from '../../lib/icons'
import type { MedicalObject } from '../../types/medical-object'
import { formatDateTime } from '../../lib/utils'
import { StatusBadge } from '../shared/Badge'
import { Modal } from '../shared/Modal'

interface MedicalRecordDetailModalProps {
  record: MedicalObject | null
  onClose: () => void
}

export function MedicalRecordDetailModal({ record, onClose }: MedicalRecordDetailModalProps) {
  if (!record) return null

  const typeConfig = getMedicalType(record.type)
  const source = getSourceSystem(record.sourceSystem)
  const Icon = getIcon(typeConfig.icon)

  const rows: { label: string; value: string }[] = [
    { label: 'Type', value: typeConfig.label },
    { label: 'What', value: record.what },
    { label: typeConfig.dateLabel, value: formatDateTime(record.when) },
    { label: 'Where', value: record.where },
    { label: 'Who', value: record.who },
    { label: 'Value', value: record.value || '—' },
    ...(record.text ? [{ label: 'Summary', value: record.text }] : []),
    ...(source ? [{ label: 'Source system', value: source.label }] : []),
    { label: 'Added to ELM', value: formatDateTime(record.added) },
    { label: 'Last updated', value: formatDateTime(record.updated) },
    ...(record.details ?? []),
  ]

  return (
    <Modal open onClose={onClose} title={record.what} className="max-w-2xl">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: typeConfig.color + '20' }}
          >
            <Icon className="h-5 w-5" style={{ color: typeConfig.color }} />
          </div>
          <div>
            <div className="font-medium text-gray-900">{typeConfig.label}</div>
            {record.status && (
              <div className="mt-1">
                <StatusBadge status={record.status} />
              </div>
            )}
          </div>
          {source && (
            <span
              className="ml-auto inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: source.color + '18', color: source.color }}
            >
              {source.shortLabel}
            </span>
          )}
        </div>

        <dl className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-1 sm:grid-cols-3 gap-1 px-4 py-3 bg-white">
              <dt className="text-sm font-medium text-gray-500">{row.label}</dt>
              <dd className="sm:col-span-2 text-sm text-gray-900 whitespace-pre-wrap">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Modal>
  )
}
