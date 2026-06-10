import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import {
  HealthcareCard,
  KpiCards,
  UpcomingAppointments,
  UpcomingBills,
} from '../components/dashboard/DashboardWidgets'

export function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        title="Good morning, Margaret 👋"
        description="Here's an overview of your affairs today."
      />
      <KpiCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <HealthcareCard />
        <UpcomingBills />
        <UpcomingAppointments />
      </div>
    </AppShell>
  )
}
