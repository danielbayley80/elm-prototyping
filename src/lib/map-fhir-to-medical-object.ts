/**
 * FHIR → MedicalObject mapping stub for production implementation.
 *
 * Upstream sources:
 * Reference: https://developer.convenet.io/convenet-documentation/index.html
 * Primary path: GET /patient/{patientId}/fhirRecord?fromdate=&todate=
 * Fallback path: GET /patient/{patientId}/record — see map-convenet-to-medical-object.ts
 *
 * Mapping rules:
 * | FHIR Resource        | what              | when                  | value           | status flag        |
 * |----------------------|-------------------|-----------------------|-----------------|--------------------|
 * | MedicationStatement  | drug name         | effectiveDateTime     | dosage          | status=active      |
 * | Condition            | condition text    | onsetDateTime         | severity        | clinicalStatus     |
 * | AllergyIntolerance   | allergen          | recordedDate          | reaction        | clinicalStatus     |
 * | Encounter            | visit type        | period.start          | —               | status             |
 * | DiagnosticReport     | test name         | issued                | conclusion      | status             |
 * | Observation          | code display      | effectiveDateTime     | valueQuantity   | status             |
 * | Immunization         | vaccine code      | occurrenceDateTime    | doseNumber      | status             |
 * | Procedure            | procedure code    | performedDateTime     | outcome         | status             |
 * | MedicationRequest    | medication        | authoredOn            | dosage          | status             |
 */

import type { MedicalObject, RecordStatus } from '../types/medical-object'

interface FhirResource {
  resourceType: string
  id: string
  meta?: { lastUpdated?: string }
  [key: string]: unknown
}

function mapClinicalStatus(status?: string): RecordStatus {
  if (!status) return 'historical'
  const lower = status.toLowerCase()
  if (lower === 'active' || lower === 'confirmed') return 'active'
  if (lower === 'resolved' || lower === 'inactive' || lower === 'remission') return 'resolved'
  return 'historical'
}

/**
 * Maps a single FHIR resource to the common MedicalObject model.
 * Production implementation should handle all GP Connect structured record sections.
 */
export function mapFhirToMedicalObject(
  resource: FhirResource,
  source: string,
): MedicalObject | null {
  const base = {
    id: resource.id,
    added: resource.meta?.lastUpdated ?? new Date().toISOString(),
    updated: resource.meta?.lastUpdated ?? new Date().toISOString(),
    source,
    text: '',
    where: '',
    who: '',
  }

  switch (resource.resourceType) {
    case 'MedicationStatement':
      return {
        ...base,
        type: 'MedicationStatement',
        what: String(resource.medicationCodeableConcept ?? 'Unknown medication'),
        when: String(resource.effectiveDateTime ?? resource.dateAsserted ?? ''),
        value: String(resource.dosage ?? ''),
        status: mapClinicalStatus(String(resource.status ?? '')),
      }
    case 'Condition':
      return {
        ...base,
        type: 'Condition',
        what: String(resource.code ?? 'Unknown condition'),
        when: String(resource.onsetDateTime ?? ''),
        value: String(resource.severity ?? ''),
        status: mapClinicalStatus(String(resource.clinicalStatus ?? '')),
      }
    default:
      return null
  }
}

/**
 * Batch map a FHIR Bundle to MedicalObject[].
 * Used when Convenet returns a structured record bundle.
 */
export function mapFhirBundleToMedicalObjects(
  entries: FhirResource[],
  source: string,
): MedicalObject[] {
  return entries
    .map((entry) => mapFhirToMedicalObject(entry, source))
    .filter((obj): obj is MedicalObject => obj !== null)
}
