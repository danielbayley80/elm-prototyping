import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'
  className?: string
}

const variants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  muted: 'bg-gray-50 text-gray-500',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status?: string }) {
  if (!status) return null
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    active: { label: 'Active', variant: 'success' },
    resolved: { label: 'Resolved', variant: 'muted' },
    historical: { label: 'Historical', variant: 'info' },
    booked: { label: 'Booked', variant: 'info' },
    completed: { label: 'Completed', variant: 'muted' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
    available: { label: 'Available', variant: 'success' },
    ordered: { label: 'Ordered', variant: 'warning' },
    ready: { label: 'Ready', variant: 'info' },
    collected: { label: 'Collected', variant: 'muted' },
  }
  const config = map[status] ?? { label: status, variant: 'default' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
