import { Link } from 'react-router-dom'
import {
  Calendar,
  FileText,
  Pill,
} from 'lucide-react'
import { HealthcarePage } from '../components/layout/HealthcarePage'
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { HealthcareConnectPrompt } from '../components/healthcare/HealthcareConnectPrompt'
import { SharingStatusCard } from '../components/healthcare/SharingStatusCard'
import { SourcesStatusCard } from '../components/healthcare/SourcesStatusCard'
import { useHealth } from '../lib/health-context'
import { isConnected } from '../types/health-connection'

export function HealthcareHubPage() {
  const { connection, appointments, prescriptions } = useHealth()

  if (!isConnected(connection)) {
    return (
      <AppShell>
        <PageHeader title="Healthcare" description="Your health dashboard" />
        <p className="text-gray-600 mb-6">
          You have not connected any health record sources yet.
        </p>
        <div className="max-w-xl">
          <HealthcareConnectPrompt showHeading={false} buttonSize="md" />
        </div>
      </AppShell>
    )
  }

  const upcomingCount = appointments.filter((a) => a.status === 'booked').length
  const availableRx = prescriptions.filter((p) => p.status === 'available').length

  return (
    <HealthcarePage title="Healthcare" description="Your health dashboard">

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SourcesStatusCard />
        <SharingStatusCard />
        <div aria-hidden className="hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/healthcare/records"
          className="block h-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-nhs-blue/30 transition-colors"
        >
          <FileText className="h-6 w-6 text-blue-500 mb-3" />
          <h3 className="font-semibold text-gray-900">Medical Records</h3>
          <p className="text-sm text-gray-500 mt-1">
            View your unified health record from connected sources
          </p>
        </Link>

        <Link
          to="/healthcare/appointments"
          className="block h-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-nhs-blue/30 transition-colors"
        >
          <Calendar className="h-6 w-6 text-cyan-500 mb-3" />
          <h3 className="font-semibold text-gray-900">Appointments</h3>
          <p className="text-sm text-gray-500 mt-1">
            {upcomingCount} upcoming appointment{upcomingCount !== 1 ? 's' : ''}
          </p>
        </Link>

        <Link
          to="/healthcare/prescriptions"
          className="block h-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-nhs-blue/30 transition-colors"
        >
          <Pill className="h-6 w-6 text-green-500 mb-3" />
          <h3 className="font-semibold text-gray-900">Prescriptions</h3>
          <p className="text-sm text-gray-500 mt-1">
            {availableRx} repeat prescription{availableRx !== 1 ? 's' : ''} available
          </p>
        </Link>
      </div>

      {connection.syncPreferences.appointmentsToCalendar && (
        <div className="mt-6 text-sm text-gray-500 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Appointments synced to your ELM calendar
        </div>
      )}
      {connection.syncPreferences.prescriptionsToCalendar && (
        <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
          <Pill className="h-4 w-4" />
          Prescription due dates synced to your ELM calendar
        </div>
      )}
    </HealthcarePage>
  )
}
