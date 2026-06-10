import { Sidebar } from './Sidebar'
import { Toast } from '../shared/Toast'
import { useHealth } from '../../lib/health-context'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { toast, clearToast } = useHealth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-60 min-h-screen">
        <div className="p-6 lg:p-8 max-w-6xl">{children}</div>
      </main>
      <Toast message={toast} onClose={clearToast} />
    </div>
  )
}
