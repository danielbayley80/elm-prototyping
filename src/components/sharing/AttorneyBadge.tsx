import { Scale } from 'lucide-react'

export function AttorneyBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-900 border border-amber-200/80">
      <Scale className="h-3 w-3 shrink-0" aria-hidden />
      Attorney
    </span>
  )
}
