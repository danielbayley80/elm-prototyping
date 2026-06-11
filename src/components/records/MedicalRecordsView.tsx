import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { getMedicalType, healthConfig } from '../../config/health-config'
import { sourceConfig, type SourceSystemId } from '../../config/source-config'
import { getIcon } from '../../lib/icons'
import type { MedicalObject } from '../../types/medical-object'
import { formatDate, cn } from '../../lib/utils'
import { StatusBadge } from '../shared/Badge'
import { SourceBadge } from './RecordsSyncBanner'

export type SortField = 'when' | 'what' | 'type' | 'where' | 'who' | 'value' | 'status'
export type SortDirection = 'asc' | 'desc'

interface RecordsFilterProps {
  selectedTypes: string[]
  onToggleType: (type: string) => void
  onClearTypes: () => void
  selectedSources: SourceSystemId[]
  onToggleSource: (source: SourceSystemId) => void
  onClearSources: () => void
  activeOnly: boolean
  onToggleActiveOnly: () => void
  sortField: SortField
  onSortFieldChange: (field: SortField) => void
  sortDirection: SortDirection
  onSortDirectionChange: (direction: SortDirection) => void
  onClearAll: () => void
  hasActiveFilters: boolean
}

const sortFieldLabels: Record<SortField, string> = {
  when: 'Date',
  what: 'What',
  type: 'Type',
  where: 'Where',
  who: 'Who',
  value: 'Value',
  status: 'Status',
}

function FilterDropdown({
  label,
  summary,
  active,
  children,
  align = 'left',
}: {
  label: string
  summary: string
  active?: boolean
  children: React.ReactNode
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-colors',
          active
            ? 'border-nhs-blue bg-blue-50 text-nhs-blue'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
        )}
        aria-expanded={open}
      >
        <span className="font-medium">{label}</span>
        <span className="text-gray-500">{summary}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 text-gray-400 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div
          className={cn(
            'absolute z-20 mt-1 min-w-[12rem] max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function FilterCheckboxOption({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: () => void
  children: React.ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-gray-300 text-nhs-blue focus:ring-nhs-blue"
      />
      <span className="flex-1">{children}</span>
    </label>
  )
}

export function RecordsFilterBar({
  selectedTypes,
  onToggleType,
  onClearTypes,
  selectedSources,
  onToggleSource,
  onClearSources,
  activeOnly,
  onToggleActiveOnly,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionChange,
  onClearAll,
  hasActiveFilters,
}: RecordsFilterProps) {
  const typeSummary =
    selectedTypes.length === 0
      ? 'All'
      : selectedTypes.length === 1
        ? getMedicalType(selectedTypes[0]).label
        : `${selectedTypes.length} selected`

  const sourceSummary =
    selectedSources.length === 0
      ? 'All'
      : selectedSources.length === 1
        ? sourceConfig[selectedSources[0]].shortLabel
        : `${selectedSources.length} selected`

  const sortSummaryLabel = `${sortFieldLabels[sortField]} · ${
    sortDirection === 'desc' ? 'Newest first' : 'Oldest first'
  }`

  const sortOptions: { field: SortField; direction: SortDirection; label: string }[] = (
    Object.keys(sortFieldLabels) as SortField[]
  ).flatMap((field) => [
    {
      field,
      direction: 'desc',
      label: `${sortFieldLabels[field]} · Newest / Z–A`,
    },
    {
      field,
      direction: 'asc',
      label: `${sortFieldLabels[field]} · Oldest / A–Z`,
    },
  ])

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
      <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />

      <FilterDropdown label="Type" summary={typeSummary} active={selectedTypes.length > 0}>
        {Object.values(healthConfig).map((typeConfig) => {
          const Icon = getIcon(typeConfig.icon)
          const checked = selectedTypes.includes(typeConfig.type)
          return (
            <FilterCheckboxOption
              key={typeConfig.type}
              checked={checked}
              onChange={() => onToggleType(typeConfig.type)}
            >
              <span className="inline-flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" style={{ color: typeConfig.color }} />
                {typeConfig.label}
              </span>
            </FilterCheckboxOption>
          )
        })}
        {selectedTypes.length > 0 && (
          <button
            type="button"
            onClick={onClearTypes}
            className="w-full border-t border-gray-100 px-3 py-2 text-left text-xs text-nhs-blue hover:bg-gray-50"
          >
            Clear type filter
          </button>
        )}
      </FilterDropdown>

      <FilterDropdown label="Source" summary={sourceSummary} active={selectedSources.length > 0}>
        {(Object.keys(sourceConfig) as SourceSystemId[]).map((sourceId) => (
          <FilterCheckboxOption
            key={sourceId}
            checked={selectedSources.includes(sourceId)}
            onChange={() => onToggleSource(sourceId)}
          >
            {sourceConfig[sourceId].label}
          </FilterCheckboxOption>
        ))}
        {selectedSources.length > 0 && (
          <button
            type="button"
            onClick={onClearSources}
            className="w-full border-t border-gray-100 px-3 py-2 text-left text-xs text-nhs-blue hover:bg-gray-50"
          >
            Clear source filter
          </button>
        )}
      </FilterDropdown>

      <button
        type="button"
        onClick={onToggleActiveOnly}
        className={cn(
          'inline-flex items-center rounded-lg border px-2.5 py-1.5 text-sm transition-colors',
          activeOnly
            ? 'border-nhs-blue bg-blue-50 text-nhs-blue'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
        )}
      >
        <span className="font-medium">Status</span>
        <span className="ml-1.5 text-gray-500">{activeOnly ? 'Active only' : 'All'}</span>
      </button>

      <FilterDropdown
        label="Sort"
        summary={sortSummaryLabel}
        active={sortField !== 'when' || sortDirection !== 'desc'}
        align="right"
      >
        {sortOptions.map((option) => {
          const selected =
            sortField === option.field && sortDirection === option.direction
          return (
            <button
              key={`${option.field}-${option.direction}`}
              type="button"
              onClick={() => {
                onSortFieldChange(option.field)
                onSortDirectionChange(option.direction)
              }}
              className={cn(
                'block w-full px-3 py-2 text-left text-sm hover:bg-gray-50',
                selected ? 'font-medium text-nhs-blue bg-blue-50/50' : 'text-gray-700',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </FilterDropdown>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="ml-auto inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
        >
          <X className="h-3.5 w-3.5" />
          Clear all
        </button>
      )}
    </div>
  )
}

function TypeCell({ type }: { type: string }) {
  const config = getMedicalType(type)
  const Icon = getIcon(config.icon)
  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-md" style={{ backgroundColor: config.color + '20' }}>
        <Icon className="h-4 w-4" style={{ color: config.color }} />
      </div>
      <span className="text-sm font-medium text-gray-700">{config.label}</span>
    </div>
  )
}

interface RecordsListProps {
  records: MedicalObject[]
  onSelect: (record: MedicalObject) => void
}

export function MedicalRecordsTable({ records, onSelect }: RecordsListProps) {
  return (
    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-gray-50 border-b border-gray-100 shadow-sm">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">What</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">When</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Where</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Who</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Source</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Value</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer"
              onClick={() => onSelect(record)}
            >
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
              <td className="px-4 py-3">
                <SourceBadge sourceSystem={record.sourceSystem} />
              </td>
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

export function MedicalRecordsList({ records, onSelect }: RecordsListProps) {
  return (
    <div className="md:hidden space-y-3">
      {records.map((record) => {
        const config = getMedicalType(record.type)
        const Icon = getIcon(config.icon)
        return (
          <button
            key={record.id}
            type="button"
            onClick={() => onSelect(record)}
            className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-nhs-blue/30 transition-colors"
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ backgroundColor: config.color + '15' }}
            >
              <Icon className="h-4 w-4" style={{ color: config.color }} />
              <span className="text-sm font-semibold" style={{ color: config.color }}>
                {config.label}
              </span>
              <span className="ml-2">
                <SourceBadge sourceSystem={record.sourceSystem} />
              </span>
              <span className="ml-auto">
                <StatusBadge status={record.status} />
              </span>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="font-medium text-gray-900">{record.what}</div>
              {record.text && <p className="text-gray-500 line-clamp-2">{record.text}</p>}
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
                  <span className="text-xs text-gray-400 block">Who</span>
                  {record.who}
                </div>
              </div>
            </div>
          </button>
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

function compareRecords(a: MedicalObject, b: MedicalObject, field: SortField): number {
  switch (field) {
    case 'when':
      return new Date(a.when).getTime() - new Date(b.when).getTime()
    case 'what':
      return a.what.localeCompare(b.what)
    case 'type':
      return getMedicalType(a.type).label.localeCompare(getMedicalType(b.type).label)
    case 'where':
      return a.where.localeCompare(b.where)
    case 'who':
      return a.who.localeCompare(b.who)
    case 'value':
      return (a.value ?? '').localeCompare(b.value ?? '')
    case 'status':
      return (a.status ?? '').localeCompare(b.status ?? '')
  }
}

export function useFilteredRecords(records: MedicalObject[]) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<SourceSystemId[]>([])
  const [activeOnly, setActiveOnly] = useState(false)
  const [sortField, setSortField] = useState<SortField>('when')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const filtered = useMemo(() => {
    let result = [...records]
    if (selectedTypes.length > 0) {
      result = result.filter((r) => selectedTypes.includes(r.type))
    }
    if (selectedSources.length > 0) {
      result = result.filter(
        (r) => r.sourceSystem && selectedSources.includes(r.sourceSystem),
      )
    }
    if (activeOnly) {
      result = result.filter((r) => r.status === 'active')
    }
    result.sort((a, b) => {
      const cmp = compareRecords(a, b, sortField)
      return sortDirection === 'asc' ? cmp : -cmp
    })
    return result
  }, [records, selectedTypes, selectedSources, activeOnly, sortField, sortDirection])

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const toggleSource = (source: SourceSystemId) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source],
    )
  }

  const clearAllFilters = () => {
    setSelectedTypes([])
    setSelectedSources([])
    setActiveOnly(false)
    setSortField('when')
    setSortDirection('desc')
  }

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedSources.length > 0 ||
    activeOnly ||
    sortField !== 'when' ||
    sortDirection !== 'desc'

  return {
    filtered,
    selectedTypes,
    toggleType,
    clearTypes: () => setSelectedTypes([]),
    selectedSources,
    toggleSource,
    clearSources: () => setSelectedSources([]),
    activeOnly,
    toggleActiveOnly: () => setActiveOnly((v) => !v),
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    clearAllFilters,
    hasActiveFilters,
  }
}

export function sortSummary(field: SortField, direction: SortDirection): string {
  const dir = direction === 'desc' ? 'descending' : 'ascending'
  return `${sortFieldLabels[field]} (${dir})`
}
