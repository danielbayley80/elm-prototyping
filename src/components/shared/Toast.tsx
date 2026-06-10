import { X } from 'lucide-react'

interface ToastProps {
  message: string | null
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-elm-navy text-white px-5 py-3 rounded-lg shadow-lg max-w-sm animate-in">
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="text-white/70 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
