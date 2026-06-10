import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Button } from '../shared/Button'

interface HealthcareConnectPromptProps {
  showHeading?: boolean
  buttonSize?: 'sm' | 'md' | 'lg'
}

export function HealthcareConnectPrompt({
  showHeading = true,
  buttonSize = 'sm',
}: HealthcareConnectPromptProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-red-50 shrink-0">
          <Heart className="h-6 w-6 text-red-500" />
        </div>
        <div className="flex-1">
          {showHeading && (
            <h3 className="font-semibold text-gray-900">Healthcare</h3>
          )}
          <p className={`text-sm text-gray-500 ${showHeading ? 'mt-1' : ''}`}>
            Connect your health records to view and manage medications, appointments, and
            prescriptions.
          </p>
          <Link to="/healthcare/connect" className="inline-block mt-3">
            <Button variant="nhs" size={buttonSize}>
              Connect my health records
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
