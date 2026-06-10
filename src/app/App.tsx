import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HealthProvider } from '../lib/health-context'
import { DashboardPage } from '../pages/DashboardPage'
import { HealthcareHubPage } from '../pages/HealthcareHubPage'
import { SelectSourcePage } from '../pages/connect/SelectSourcePage'
import { ConnectedSourcesPage } from '../pages/sources/ConnectedSourcesPage'
import { NhsLoginPage } from '../pages/connect/NhsLoginPage'
import { ConsentPage } from '../pages/connect/ConsentPage'
import { SourceCapabilitiesPage } from '../pages/connect/SourceCapabilitiesPage'
import { SyncOptionsPage } from '../pages/connect/SyncOptionsPage'
import { MedicalRecordsPage } from '../pages/records/MedicalRecordsPage'
import { AppointmentsPage } from '../pages/appointments/AppointmentsPage'
import { PrescriptionsPage } from '../pages/prescriptions/PrescriptionsPage'
import { SharingPage } from '../pages/sharing/SharingPage'
import { AddShareRecipientPage } from '../pages/sharing/AddShareRecipientPage'
import { AddShareScopePage } from '../pages/sharing/AddShareScopePage'
import { AddShareTermsPage } from '../pages/sharing/AddShareTermsPage'
import { AddShareConsentPage } from '../pages/sharing/AddShareConsentPage'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

export function App() {
  return (
    <HealthProvider>
      <BrowserRouter basename={routerBasename || undefined}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/healthcare" element={<HealthcareHubPage />} />
          <Route path="/healthcare/sources" element={<ConnectedSourcesPage />} />
          <Route path="/healthcare/sources/add" element={<SelectSourcePage />} />
          <Route path="/healthcare/connect" element={<SelectSourcePage />} />
          <Route path="/healthcare/connect/select" element={<Navigate to="/healthcare/connect" replace />} />
          <Route path="/healthcare/connect/nhs" element={<NhsLoginPage />} />
          <Route path="/healthcare/connect/consent" element={<ConsentPage />} />
          <Route path="/healthcare/connect/capabilities" element={<SourceCapabilitiesPage />} />
          <Route path="/healthcare/sources/:sourceId/capabilities" element={<SourceCapabilitiesPage />} />
          <Route path="/healthcare/connect/sync" element={<SyncOptionsPage />} />
          <Route path="/healthcare/records" element={<MedicalRecordsPage />} />
          <Route path="/healthcare/appointments" element={<AppointmentsPage />} />
          <Route path="/healthcare/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/healthcare/sharing" element={<SharingPage />} />
          <Route path="/healthcare/sharing/add" element={<AddShareRecipientPage />} />
          <Route path="/healthcare/sharing/add/scope" element={<AddShareScopePage />} />
          <Route path="/healthcare/sharing/add/terms" element={<AddShareTermsPage />} />
          <Route path="/healthcare/sharing/add/consent" element={<AddShareConsentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HealthProvider>
  )
}
