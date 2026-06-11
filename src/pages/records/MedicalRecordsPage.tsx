import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HealthcarePage } from '../../components/layout/HealthcarePage'
import {
  MedicalRecordsList,
  MedicalRecordsTable,
  RecordsFilterBar,
  sortSummary,
  useFilteredRecords,
} from '../../components/records/MedicalRecordsView'
import { MedicalRecordDetailModal } from '../../components/records/MedicalRecordDetailModal'
import { NativeRecordsPanel } from '../../components/records/NativeRecordsPanel'
import { RecordsSyncBanner } from '../../components/records/RecordsSyncBanner'
import { mockMedicalRecords } from '../../mocks/medical-records'
import { useHealth } from '../../lib/health-context'
import { isConnected } from '../../types/health-connection'
import type { MedicalObject } from '../../types/medical-object'

export function MedicalRecordsPage() {
  const navigate = useNavigate()
  const { connection } = useHealth()
  const [selectedRecord, setSelectedRecord] = useState<MedicalObject | null>(null)

  const {
    filtered,
    selectedTypes,
    toggleType,
    clearTypes,
    selectedSources,
    toggleSource,
    clearSources,
    activeOnly,
    toggleActiveOnly,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    clearAllFilters,
    hasActiveFilters,
  } = useFilteredRecords(mockMedicalRecords)

  if (!isConnected(connection)) {
    navigate('/healthcare', { replace: true })
    return null
  }

  return (
    <HealthcarePage
      title="Medical records"
      description="Unified personal health record from your connected sources."
      action={<RecordsSyncBanner sources={connection.connectedSources} />}
    >
      <div className="flex flex-col gap-4">
        <RecordsFilterBar
          selectedTypes={selectedTypes}
          onToggleType={toggleType}
          onClearTypes={clearTypes}
          selectedSources={selectedSources}
          onToggleSource={toggleSource}
          onClearSources={clearSources}
          activeOnly={activeOnly}
          onToggleActiveOnly={toggleActiveOnly}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortDirection={sortDirection}
          onSortDirectionChange={setSortDirection}
          onClearAll={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="text-sm text-gray-500">
          Showing {filtered.length} of {mockMedicalRecords.length} records — sorted by{' '}
          {sortSummary(sortField, sortDirection)}
        </div>

        <div className="overflow-y-auto max-h-[min(36rem,calc(100vh-17rem))] rounded-xl">
          <MedicalRecordsTable records={filtered} onSelect={setSelectedRecord} />
          <MedicalRecordsList records={filtered} onSelect={setSelectedRecord} />
        </div>

        <NativeRecordsPanel />

        <MedicalRecordDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      </div>
    </HealthcarePage>
  )
}
