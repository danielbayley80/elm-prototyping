import { AppShell } from './AppShell'
import { PageHeader } from './PageHeader'
import { PatientBanner } from '../healthcare/PatientBanner'

interface HealthcarePageProps {
  title: string
  description?: string
  action?: React.ReactNode
  patientBanner?: boolean
  children: React.ReactNode
}

export function HealthcarePage({
  title,
  description,
  action,
  patientBanner = true,
  children,
}: HealthcarePageProps) {
  return (
    <AppShell>
      <PageHeader title={title} description={description} action={action} />
      {patientBanner && <PatientBanner />}
      {children}
    </AppShell>
  )
}
