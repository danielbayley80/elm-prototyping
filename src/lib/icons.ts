import {
  Ban,
  Calendar,
  ClipboardList,
  Cpu,
  Cross,
  Eye,
  FileQuestion,
  FileText,
  FlaskConical,
  Image,
  Pill,
  Stethoscope,
  Syringe,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { IconName } from '../types/medical-type'

const iconMap: Record<IconName, LucideIcon> = {
  Pill,
  Syringe,
  FileText,
  Stethoscope,
  Eye,
  Ban,
  Calendar,
  Cross,
  FlaskConical,
  Image,
  ClipboardList,
  Users,
  Cpu,
  FileQuestion,
}

export function getIcon(name: IconName): LucideIcon {
  return iconMap[name] ?? FileQuestion
}
