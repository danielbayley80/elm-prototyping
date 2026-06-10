import { useMemo, useState } from 'react'
import { getMedicalType, healthConfig } from '../../config/health-config'
import { getIcon } from '../../lib/icons'
import type { MedicalObject } from '../../types/medical-object'
import { formatDate } from '../../lib/utils'
import { StatusBadge } from '../shared/Badge'

interface RecordsFilterProps {
  selectedTypes: string[]
  onToggleType: (type: string) => void
  activeOnly: boolean
  onToggleActiveOnly: () => void
}

export function RecordsFilterBar({
  selectedTypes,
  onToggleType,
  activeOnly,
  onToggleActiveOnly,
}: RecordsFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Object.values(healthConfig).map((typeConfig) => {
          const selected = selectedTypes.includes(typeConfig.type)
          const Icon = getIcon(typeConfig.icon)
          return (
            <button
              key={typeConfig.type}
              onClick={() => onToggleType(typeConfig.type)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={{
                backgroundColor: selected ? typeConfig.color + '20' : 'white',
                borderColor: selected ? typeConfig.color : '#e5e7eb',
                color: selected ? typeConfig.color : '#6b7280',
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              {typeConfig.label}
            </button>
          )
        })}
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={activeOnly}
          onChange={onToggleActiveOnly}
          className="rounded border-gray-300 text-nhs-blue focus:ring-nhs-blue"
        />
        Show active records only
      </label>
    </div>
  )
}

function TypeCell({ type }: { type: string }) {
  const config = getMedicalType(type)
  const Icon = getIcon(config.icon)
  return (
    <div className="flex items-center gap-2">
      <div
        className="p-1.5 rounded-md"
        style={{ backgroundColor: config.color + '20' }}
      >
        <Icon className="h-4 w-4" style={{ color: config.color }} />
      </div>
      <span className="text-sm font-medium text-gray-700">{config.label}</span>
    </div>
  )
}

export function MedicalRecordsTable({ records }: { records: MedicalObject[] }) {
  return (
    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">What</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">When</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Where</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Who</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Value</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50/50">
              <td className="px-4 py-3">
                <TypeCell type={record.type} />
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{record.what}</div>
                {record.text && (
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{record.text}</div>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                {formatDate(record.when)}
              </td>
              <td className="px-4 py-3 text-gray-600">{record.where}</td>
              <td className="px-4 py-3 text-gray-600">{record.who}</td>
              <td className="px-4 py-3 text-gray-600">{record.value}</td>
              <td className="px-4 py-3">
                <StatusBadge status={record.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {records.length === 0 && (
        <div className="p-8 text-center text-gray-500">No records match your filters.</div>
      )}
    </div>
  )
}

export function MedicalRecordsList({ records }: { records: MedicalObject[] }) {
  return (
    <div className="md:hidden space-y-3">
      {records.map((record) => {
        const config = getMedicalType(record.type)
        const Icon = getIcon(config.icon)
        return (
          <div
            key={record.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ backgroundColor: config.color + '15' }}
            >
              <Icon className="h-4 w-4" style={{ color: config.color }} />
              <span className="text-sm font-semibold" style={{ color: config.color }}>
                {config.label}
              </span>
              <span className="ml-auto">
                <StatusBadge status={record.status} />
              </span>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="font-medium text-gray-900">{record.what}</div>
              {record.text && <p className="text-gray-500">{record.text}</p>}
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div>
                  <span className="text-xs text-gray-400 block">{config.dateLabel}</span>
                  {formatDate(record.when)}
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Value</span>
                  {record.value || '—'}
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Where</span>
                  {record.where}
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Clinician</span>
                  {record.who}
                </div>
              </div>
            </div>
          </div>
        )
      })}
      {records.length === 0 && (
        <div className="p-8 text-center text-gray-500 bg-white rounded-xl">
          No records match your filters.
        </div>
      )}
    </div>
  )
}

export function useFilteredRecords(records: MedicalObject[]) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [activeOnly, setActiveOnly] = useState(false)

  const filtered = useMemo(() => {
    let result = [...records]
    if (selectedTypes.length > 0) {
      result = result.filter((r) => selectedTypes.includes(r.type))
    }
    if (activeOnly) {
      result = result.filter((r) => r.status === 'active')
    }
    result.sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
    return result
  }, [records, selectedTypes, activeOnly])

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  return {
    filtered,
    selectedTypes,
    toggleType,
    activeOnly,
    toggleActiveOnly: () => setActiveOnly((v) => !v),
  }
}
