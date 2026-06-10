import { NavLink, useLocation } from 'react-router-dom'
import {
  Bell,
  FileText,
  Heart,
  LayoutDashboard,
  PoundSterling,
  Scale,
  BarChart3,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useHealth, isConnected } from '../../lib/health-context'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/financial', label: 'Financial', icon: PoundSterling, placeholder: true },
  { to: '/healthcare', label: 'Healthcare', icon: Heart },
  { to: '/lpa', label: 'LPA', icon: Scale, placeholder: true },
  { to: '/documents', label: 'Documents', icon: FileText, placeholder: true },
  { to: '/reports', label: 'Reports', icon: BarChart3, placeholder: true },
  { to: '/notifications', label: 'Notifications', icon: Bell, placeholder: true },
]

export function Sidebar() {
  const location = useLocation()
  const { connection, showToast } = useHealth()

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-elm-navy text-white flex flex-col z-40">
      <div className="p-5 border-b border-white/10">
        <div className="text-xl font-bold tracking-tight">ELM</div>
        <div className="text-xs text-white/60 mt-0.5">Life Management</div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon, placeholder }) => {
          const isActive =
            to === '/'
              ? location.pathname === '/'
              : to === '/healthcare'
                ? location.pathname.startsWith('/healthcare')
                : location.pathname.startsWith(to)

          if (placeholder) {
            return (
              <button
                key={to}
                onClick={() => showToast(`${label} — coming soon in full platform`)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white/70 hover:bg-white/5 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            )
          }

          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/10',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {to === '/healthcare' && isConnected(connection) && (
                <span className="ml-auto h-2 w-2 rounded-full bg-green-400" />
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
            MT
          </div>
          <div>
            <div className="text-sm font-medium">Margaret Thompson</div>
            <div className="text-xs text-white/50">Donor</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
