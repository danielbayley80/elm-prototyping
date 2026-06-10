export type RecordStatus = 'active' | 'resolved' | 'historical'

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
  source?: string
}
