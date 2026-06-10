import type { LucideIcon } from 'lucide-react'
import { Building2, Heart, Hospital, Stethoscope } from 'lucide-react'

export interface HealthSource {
  id: string
  name: string
  description: string
  region: string
  available: boolean
  icon: LucideIcon
}

export const healthSources: HealthSource[] = [
  {
    id: 'nhs-england-gp',
    name: 'NHS GP (England)',
    description:
      'Connect your GP medical record via NHS Login. Includes medications, conditions, appointments, and repeat prescriptions.',
    region: 'England',
    available: true,
    icon: Stethoscope,
  },
  {
    id: 'nhs-scotland',
    name: 'NHS Scotland',
    description: 'Scottish health records via NHS Scotland services.',
    region: 'Scotland',
    available: false,
    icon: Heart,
  },
  {
    id: 'nhs-wales',
    name: 'NHS Wales',
    description: 'Welsh health records via NHS Wales digital services.',
    region: 'Wales',
    available: false,
    icon: Hospital,
  },
  {
    id: 'private-gp',
    name: 'Private GP',
    description: 'Connect records from private GP practices and clinics.',
    region: 'UK',
    available: false,
    icon: Building2,
  },
  {
    id: 'dental',
    name: 'Dental Records',
    description: 'NHS and private dental treatment history.',
    region: 'UK',
    available: false,
    icon: Stethoscope,
  },
  {
    id: 'hospital',
    name: 'Hospital Records',
    description: 'Secondary care records from NHS hospitals.',
    region: 'UK',
    available: false,
    icon: Hospital,
  },
]
