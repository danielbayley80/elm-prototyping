import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { HealthcarePage } from '../../components/layout/HealthcarePage'
import { ConnectedSourceCard } from '../../components/healthcare/ConnectedSourceCard'
import { Button } from '../../components/shared/Button'
import { useHealth } from '../../lib/health-context'
import { isConnected } from '../../types/health-connection'

export function ConnectedSourcesPage() {
  const navigate = useNavigate()
  const { connection } = useHealth()

  if (!isConnected(connection)) {
    navigate('/healthcare', { replace: true })
    return null
  }

  return (
    <HealthcarePage
      title="Connected sources"
      description="Manage your connected health record sources"
      action={
        <Link to="/healthcare/sources/add">
          <Button variant="nhs" size="sm">
            <Plus className="h-4 w-4" />
            Add a source
          </Button>
        </Link>
      }
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {connection.connectedSources.map((source) => (
          <ConnectedSourceCard key={source.id} source={source} />
        ))}
      </div>
    </HealthcarePage>
  )
}
