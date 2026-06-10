import { useNavigate, useLocation } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { AppShell } from '../../components/layout/AppShell'
import { PatientBanner } from '../../components/healthcare/PatientBanner'
import {
  ConnectStepHeader,
  SourceCard,
} from '../../components/connect/ConnectComponents'
import { healthSources } from '../../mocks/health-sources'
import { useHealth } from '../../lib/health-context'
import { isConnected } from '../../types/health-connection'

export function SelectSourcePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { connection, connectSource, showToast } = useHealth()

  const isAddMode = location.pathname.includes('/sources/add')
  const connectedIds = new Set(connection.connectedSources.map((s) => s.id))
  const sources = isAddMode
    ? healthSources.filter((s) => !connectedIds.has(s.id))
    : healthSources

  const backTo = isAddMode ? '/healthcare/sources' : isConnected(connection) ? '/healthcare' : '/'

  return (
    <AppShell>
      <ConnectStepHeader
        step={1}
        total={4}
        title={isAddMode ? 'Add a health source' : 'Select your health source'}
        backTo={backTo}
      />
      <PatientBanner />

      <div className="max-w-4xl">
        {!isAddMode && (
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 rounded-lg bg-red-50 shrink-0">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Bring your health data into ELM</h2>
              <p className="text-sm text-gray-500 mt-1">
                Connect your GP medical record to view medications, conditions, lab results, book
                appointments, and order repeat prescriptions — securely managed in one place.
              </p>
            </div>
          </div>
        )}

        {isAddMode && (
          <p className="text-sm text-gray-500 mb-6">
            Choose an additional health record source to connect.
          </p>
        )}

        {sources.length === 0 ? (
          <p className="text-sm text-gray-500">All available sources are already connected.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                onSelect={(s) => {
                  connectSource(s.id, s.name, s.region)
                  navigate('/healthcare/connect/consent')
                }}
                onUnavailable={(s) => {
                  showToast(`${s.name} — coming soon`)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
