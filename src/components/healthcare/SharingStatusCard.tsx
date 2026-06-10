import { Link } from 'react-router-dom'
import { Share2 } from 'lucide-react'
import { useHealth } from '../../lib/health-context'
import { formatDateTime } from '../../lib/utils'
import {
  activeShareCount,
  mostRecentShareAccess,
} from '../../types/health-sharing'
import { isConnected } from '../../types/health-connection'

export function SharingStatusCard() {
  const { connection, shares, lpaHealthWelfareActive } = useHealth()

  if (!isConnected(connection)) return null

  const count = activeShareCount(shares, lpaHealthWelfareActive)
  const lastAccess = mostRecentShareAccess(shares)

  return (
    <Link
      to="/healthcare/sharing"
      className="block h-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-nhs-blue/30 transition-colors"
    >
      <Share2 className="h-6 w-6 text-purple-600 mb-3" />
      <h3 className="font-semibold text-gray-900">Sharing</h3>
      <p className="text-sm text-gray-500 mt-1">
        {count} active share{count !== 1 ? 's' : ''}
        {lastAccess && (
          <>
            {' '}
            · Last accessed {formatDateTime(lastAccess)}
          </>
        )}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Manage who can view your health data and under what terms
      </p>
    </Link>
  )
}
