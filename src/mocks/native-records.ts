/** Mock items that cannot be normalised into MedicalObject — shown in source-specific UI */
export interface NativeRecordItem {
  id: string
  sourceSystem: 'emis' | 'tpp'
  title: string
  category: string
  date: string
  description: string
}

export const mockNativeDocuments: NativeRecordItem[] = [
  {
    id: 'doc-001',
    sourceSystem: 'emis',
    title: 'Referral letter — cardiology',
    category: 'Correspondence',
    date: '2024-08-12T00:00:00Z',
    description: 'PDF attachment. Layout and fields as stored in EMIS Web.',
  },
  {
    id: 'doc-002',
    sourceSystem: 'emis',
    title: 'Discharge summary scan',
    category: 'Hospital document',
    date: '2023-03-23T00:00:00Z',
    description: 'Scanned PDF. Not mapped to unified record columns.',
  },
  {
    id: 'doc-003',
    sourceSystem: 'tpp',
    title: 'Care plan attachment',
    category: 'Care plan',
    date: '2024-01-15T00:00:00Z',
    description: 'Structured care plan export from SystmOne native viewer.',
  },
]
