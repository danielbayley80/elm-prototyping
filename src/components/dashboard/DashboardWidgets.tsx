import { Link } from 'react-router-dom'
import { Calendar, Heart, Pill, Shield } from 'lucide-react'
import { HealthcareConnectPrompt } from '../healthcare/HealthcareConnectPrompt'
import { useHealth, isConnected } from '../../lib/health-context'
import { canOrderPrescription } from '../../types/prescription'
import { formatDateTime } from '../../lib/utils'

export function HealthcareCard() {
  const { connection, appointments, prescriptions } = useHealth()

  const upcomingAppt = appointments
    .filter((a) => a.status === 'booked')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0]

  const medsDue = prescriptions.filter((p) => canOrderPrescription(p)).length

  if (!isConnected(connection)) {
    return <HealthcareConnectPrompt />
  }

  const sourceCount = connection.connectedSources.length

  return (
    <Link
      to="/healthcare"
      className="block bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-nhs-blue/30 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-green-50">
          <Heart className="h-6 w-6 text-green-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">Healthcare</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Connected
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {sourceCount} source{sourceCount !== 1 ? 's' : ''} connected
          </p>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1.5 text-gray-600">
              <Pill className="h-4 w-4 text-green-500" />
              {medsDue} medications due
            </span>
            {upcomingAppt && (
              <span className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="h-4 w-4 text-cyan-500" />
                Next: {formatDateTime(upcomingAppt.dateTime)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function KpiCards() {
  const { connection, prescriptions } = useHealth()
  const medsDue = isConnected(connection)
    ? prescriptions.filter((p) => canOrderPrescription(p)).length
    : 2

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="text-sm text-gray-500">Monthly Expenses</div>
        <div className="text-2xl font-bold text-gray-900 mt-1">£3,420</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="text-sm text-gray-500">Medications Due</div>
        <div className="text-2xl font-bold text-gray-900 mt-1">{medsDue}</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="text-sm text-gray-500">LPA Status</div>
        <div className="flex items-center gap-2 mt-1">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="text-2xl font-bold text-green-600">Active</span>
        </div>
      </div>
    </div>
  )
}

export function UpcomingBills() {
  const bills = [
    { name: 'British Gas', amount: '£89.00' },
    { name: 'NHS Prescription', amount: '£9.90' },
    { name: 'Council Tax', amount: '£142.00' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Upcoming Bills</h3>
      <ul className="space-y-3">
        {bills.map((bill) => (
          <li key={bill.name} className="flex justify-between text-sm">
            <span className="text-gray-700">{bill.name}</span>
            <span className="font-medium text-gray-900">{bill.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function UpcomingAppointments() {
  const { connection, appointments } = useHealth()

  const items = isConnected(connection)
    ? appointments
        .filter((a) => a.status === 'booked')
        .slice(0, 3)
        .map((a) => ({
          title: a.type,
          subtitle: a.clinician,
          date: new Date(a.dateTime).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          }),
        }))
    : [
        { title: 'Dr. Patel — GP', subtitle: 'General check-up', date: '14 May' },
        { title: 'Cardiologist', subtitle: 'Follow-up', date: '14 May' },
        { title: 'Dentist', subtitle: 'Routine check', date: '22 May' },
      ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Appointments</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between text-sm">
            <div>
              <div className="text-gray-900 font-medium">{item.title}</div>
              <div className="text-gray-500">{item.subtitle}</div>
            </div>
            <span className="text-gray-500">{item.date}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
