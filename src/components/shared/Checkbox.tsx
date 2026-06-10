import { cn } from '../../lib/utils'

interface CheckboxProps {
  id: string
  label: React.ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Checkbox({
  id,
  label,
  checked,
  onChange,
  disabled,
  className,
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-start gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-nhs-blue focus:ring-nhs-blue"
      />
      <span className="text-sm text-gray-700 leading-relaxed">{label}</span>
    </label>
  )
}
