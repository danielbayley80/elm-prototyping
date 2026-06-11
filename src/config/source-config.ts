export type SourceSystemId = 'emis' | 'tpp' | 'self'

export interface SourceSystemConfig {
  id: SourceSystemId
  label: string
  shortLabel: string
  color: string
}

export const sourceConfig: Record<SourceSystemId, SourceSystemConfig> = {
  emis: {
    id: 'emis',
    label: 'EMIS Web',
    shortLabel: 'EMIS',
    color: '#2563eb',
  },
  tpp: {
    id: 'tpp',
    label: 'TPP SystmOne',
    shortLabel: 'TPP',
    color: '#7c3aed',
  },
  self: {
    id: 'self',
    label: 'Self reported',
    shortLabel: 'Self reported',
    color: '#059669',
  },
}

export function getSourceSystem(id?: string): SourceSystemConfig | null {
  if (!id) return null
  return sourceConfig[id as SourceSystemId] ?? null
}

export function inferSourceSystem(source?: string): SourceSystemId | undefined {
  if (!source) return undefined
  const lower = source.toLowerCase()
  if (lower.includes('emis')) return 'emis'
  if (lower.includes('tpp') || lower.includes('systm')) return 'tpp'
  if (lower.includes('self')) return 'self'
  return undefined
}
