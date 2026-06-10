import { HealthcarePage } from '../../components/layout/HealthcarePage'
import {
  MedicalRecordsList,
  MedicalRecordsTable,
  RecordsFilterBar,
  useFilteredRecords,
} from '../../components/records/MedicalRecordsView'
import { mockMedicalRecords } from '../../mocks/medical-records'

export function MedicalRecordsPage() {
  const { filtered, selectedTypes, toggleType, activeOnly, toggleActiveOnly } =
    useFilteredRecords(mockMedicalRecords)

  return (
    <HealthcarePage
      title="Medical Records"
      description="Unified view of your GP record, mapped from EMIS, TPP, and other clinical systems."
    >

      <div className="mb-6">
        <RecordsFilterBar
          selectedTypes={selectedTypes}
          onToggleType={toggleType}
          activeOnly={activeOnly}
          onToggleActiveOnly={toggleActiveOnly}
        />
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Showing {filtered.length} of {mockMedicalRecords.length} records — sorted by date
        (newest first)
      </div>

      <MedicalRecordsTable records={filtered} />
      <MedicalRecordsList records={filtered} />
    </HealthcarePage>
  )
}
