/**
 * Convenet native schema1 → MedicalObject mapping stub.
 *
 * Source: GET /patient/{patientId}/record?fromdate=&todate=
 * Reference: https://developer.convenet.io/convenet-documentation/index.html
 *
 * Convenet returns schema1.medicalRecord with sections:
 *   allergies, testResults, medication, consultations, immunisations, problems
 * Plus schema3 for documents.
 *
 * Use this mapper when FHIR bundle (/fhirRecord) is unavailable or incomplete.
 * Prefer map-fhir-to-medical-object.ts when /fhirRecord is available.
 */

import type { MedicalObject, RecordStatus } from '../types/medical-object'

interface EffectiveDate {
  datePart?: string
  value?: string
}

interface Schema1Observation {
  eventGuid?: string
  term?: string
  displayValue?: string
  textValue?: string
  effectiveDate?: EffectiveDate
  episodicity?: string
  numericValue?: number
  numericUnits?: string
  associatedText?: Array<{ textType?: string; text?: string }>
}

interface Schema1Medication {
  eventGuid?: string
  drugName?: string
  dosage?: string
  drugStatus?: string
  effectiveDate?: EffectiveDate
  lastIssueDate?: string
  firstIssueDate?: string
  term?: string
}

interface Schema1Consultation {
  eventGuid?: string
  term?: string
  consultantName?: string
  location?: string
  effectiveDate?: EffectiveDate
}

interface ConvenetNativeRecord {
  schema1?: {
    medicalRecord?: {
      allergies?: Schema1Observation[]
      testResults?: Array<{ value?: Schema1Observation; childValues?: Schema1Observation[] }>
      medication?: Schema1Medication[]
      consultations?: Schema1Consultation[]
      immunisations?: Schema1Observation[]
      problems?: {
        observation?: Schema1Observation
        status?: string
        problemEndDate?: string
      }
    }
  }
  schema3?: Array<{
    date?: string
    location?: string
    doneBy?: string
    recordItems?: Array<{ details?: string; type?: string }>
  }>
}

function parseDate(d?: EffectiveDate | string): string {
  if (!d) return new Date().toISOString()
  if (typeof d === 'string') return d
  return d.value ?? new Date().toISOString()
}

function mapEpisodicity(episodicity?: string, status?: string): RecordStatus {
  if (status?.toLowerCase() === 'resolved') return 'resolved'
  if (episodicity?.toLowerCase() === 'historical') return 'historical'
  return 'active'
}

function obsToMedicalObject(
  obs: Schema1Observation,
  type: string,
  source: string,
): MedicalObject {
  const text = obs.associatedText?.map((t) => t.text).filter(Boolean).join('; ') ?? ''
  return {
    id: obs.eventGuid ?? crypto.randomUUID(),
    type,
    what: obs.term ?? obs.displayValue ?? 'Unknown',
    when: parseDate(obs.effectiveDate),
    where: '',
    who: '',
    text,
    value: obs.displayValue ?? obs.textValue ?? (obs.numericValue != null ? `${obs.numericValue} ${obs.numericUnits ?? ''}`.trim() : ''),
    added: parseDate(obs.effectiveDate),
    updated: parseDate(obs.effectiveDate),
    status: mapEpisodicity(obs.episodicity),
    source,
  }
}

/**
 * Maps Convenet GET /patient/{patientId}/record response to MedicalObject[].
 */
export function mapConvenetNativeToMedicalObjects(
  record: ConvenetNativeRecord,
  source = 'Convenet',
): MedicalObject[] {
  const results: MedicalObject[] = []
  const mr = record.schema1?.medicalRecord
  if (!mr) return results

  mr.medication?.forEach((med) => {
    results.push({
      id: med.eventGuid ?? crypto.randomUUID(),
      type: 'MedicationStatement',
      what: med.drugName ?? med.term ?? 'Unknown medication',
      when: parseDate(med.effectiveDate ?? med.lastIssueDate),
      where: '',
      who: '',
      text: '',
      value: med.dosage ?? '',
      added: parseDate(med.firstIssueDate),
      updated: parseDate(med.lastIssueDate ?? med.effectiveDate),
      status: med.drugStatus?.toLowerCase() === 'active' ? 'active' : 'historical',
      source,
    })
  })

  mr.allergies?.forEach((a) => results.push(obsToMedicalObject(a, 'AllergyIntolerance', source)))
  mr.immunisations?.forEach((i) => results.push(obsToMedicalObject(i, 'Immunization', source)))

  mr.testResults?.forEach((tr) => {
    if (tr.value) results.push(obsToMedicalObject(tr.value, 'DiagnosticReport', source))
    tr.childValues?.forEach((cv) => results.push(obsToMedicalObject(cv, 'Observation', source)))
  })

  mr.consultations?.forEach((c) => {
    results.push({
      id: c.eventGuid ?? crypto.randomUUID(),
      type: 'Encounter',
      what: c.term ?? 'Consultation',
      when: parseDate(c.effectiveDate),
      where: c.location ?? '',
      who: c.consultantName ?? '',
      text: '',
      value: '',
      added: parseDate(c.effectiveDate),
      updated: parseDate(c.effectiveDate),
      status: 'historical',
      source,
    })
  })

  if (mr.problems?.observation) {
    results.push({
      ...obsToMedicalObject(mr.problems.observation, 'Condition', source),
      status: mapEpisodicity(undefined, mr.problems.status),
    })
  }

  record.schema3?.forEach((doc, i) => {
    doc.recordItems?.forEach((item, j) => {
      results.push({
        id: `doc-${i}-${j}`,
        type: 'DiagnosticReport',
        what: item.type ?? item.details ?? 'Document',
        when: doc.date ?? new Date().toISOString(),
        where: doc.location ?? '',
        who: doc.doneBy ?? '',
        text: item.details ?? '',
        value: '',
        added: doc.date ?? new Date().toISOString(),
        updated: doc.date ?? new Date().toISOString(),
        status: 'historical',
        source,
      })
    })
  })

  return results.sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
}
