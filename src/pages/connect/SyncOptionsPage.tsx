import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Bell, Calendar, Pill } from 'lucide-react'
import { AppShell } from '../../components/layout/AppShell'
import { PatientBanner } from '../../components/healthcare/PatientBanner'
import { ConnectStepHeader } from '../../components/connect/ConnectComponents'
import { Button } from '../../components/shared/Button'
import { Checkbox } from '../../components/shared/Checkbox'
import { useHealth } from '../../lib/health-context'

export function SyncOptionsPage() {
  const navigate = useNavigate()
  const { connection, setSyncPreferences, completeConnection, showToast } = useHealth()
  const prefs = connection.syncPreferences

  const handleFinish = () => {
    flushSync(() => {
      completeConnection()
    })
    showToast('Health records connected successfully!')
    navigate('/healthcare', { replace: true })
  }

  return (
    <AppShell>
      <ConnectStepHeader
        step={4}
        total={4}
        title="Sync preferences"
        backTo="/healthcare/connect/nhs"
      />
      <PatientBanner />

      <div className="max-w-2xl">
        <p className="text-sm text-gray-500 mb-6">
          Choose how ELM should process your health data into the core platform. You can change
          these settings at any time.
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-cyan-50">
                <Calendar className="h-5 w-5 text-cyan-600" />
              </div>
              <div className="flex-1">
                <Checkbox
                  id="appt-sync"
                  checked={prefs.appointmentsToCalendar}
                  onChange={(v) => setSyncPreferences({ appointmentsToCalendar: v })}
                  label={
                    <span>
                      <strong>Connect appointments to platform events & calendar</strong>
                      <span className="block text-gray-500 font-normal mt-0.5">
                        GP appointments will appear in your ELM calendar with reminders before
                        each visit.
                      </span>
                    </span>
                  }
                />
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-green-50">
                <Pill className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <Checkbox
                  id="rx-sync"
                  checked={prefs.prescriptionsToCalendar}
                  onChange={(v) => setSyncPreferences({ prescriptionsToCalendar: v })}
                  label={
                    <span>
                      <strong>Connect prescriptions to platform events & calendar</strong>
                      <span className="block text-gray-500 font-normal mt-0.5">
                        Repeat prescription due dates and collection reminders will be added to
                        your ELM calendar and notifications.
                      </span>
                    </span>
                  }
                />
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-amber-50">
                <Bell className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <Checkbox
                  id="notifications"
                  checked={prefs.notificationsEnabled}
                  onChange={(v) => setSyncPreferences({ notificationsEnabled: v })}
                  label={
                    <span>
                      <strong>Enable health notifications</strong>
                      <span className="block text-gray-500 font-normal mt-0.5">
                        Receive in-app and email alerts for appointments, prescription renewals,
                        and health record updates.
                      </span>
                    </span>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <Button variant="nhs" className="mt-6" onClick={handleFinish}>
          Finish setup
        </Button>
      </div>
    </AppShell>
  )
}
