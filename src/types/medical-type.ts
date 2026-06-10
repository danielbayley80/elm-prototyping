import type { LucideIcon } from 'lucide-react'

export type IconName =
  | 'Pill'
  | 'Syringe'
  | 'FileText'
  | 'Stethoscope'
  | 'Eye'
  | 'Ban'
  | 'Calendar'
  | 'Cross'
  | 'FlaskConical'
  | 'Image'
  | 'ClipboardList'
  | 'Users'
  | 'Cpu'
  | 'FileQuestion'

export interface MedicalType {
  type: string
  label: string
  icon: IconName
  color: string
  dateLabel: string
}

export interface MedicalTypeWithIcon extends MedicalType {
  IconComponent: LucideIcon
}
