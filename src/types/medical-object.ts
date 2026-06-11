export type RecordStatus = 'active' | 'resolved' | 'historical'

export interface MedicalObjectDetail {
  label: string
  value: string
}

export interface MedicalObject {
  id: string
  type: string
  what: string
  when: string
  where: string
  who: string
  text: string
  value: string
  added: string
  updated: string
  status?: RecordStatus
  /** @deprecated use sourceSystem */
  source?: string
  sourceSystem?: 'emis' | 'tpp' | 'self'
  details?: MedicalObjectDetail[]
}
