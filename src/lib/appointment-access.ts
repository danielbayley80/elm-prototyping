import type { SourceCapabilities } from '../types/source-capabilities'
import { isServiceAvailable } from '../types/source-capabilities'

export interface AppointmentsAccess {
  available: boolean
  canBook: boolean
  disabledReason?: string
}

export function getAppointmentsAccess(
  capabilities?: SourceCapabilities,
): AppointmentsAccess {
  if (!capabilities) {
    return {
      available: false,
      canBook: false,
      disabledReason: 'Connect a health source to view GP appointments.',
    }
  }

  if (!capabilities.practiceAppointmentsSupported) {
    return {
      available: false,
      canBook: false,
      disabledReason: 'Your practice does not support online appointments.',
    }
  }

  if (!capabilities.appointmentsEnabled) {
    return {
      available: false,
      canBook: false,
      disabledReason: 'Appointments are not enabled for your account at this practice.',
    }
  }

  return { available: true, canBook: true }
}

export function getPrimarySourceCapabilities(
  sources: { capabilities?: SourceCapabilities }[],
): SourceCapabilities | undefined {
  return sources.find((s) => s.capabilities)?.capabilities
}

export function appointmentsAvailableForSource(
  capabilities?: SourceCapabilities,
): boolean {
  if (!capabilities) return false
  return isServiceAvailable(
    capabilities.appointmentsEnabled,
    capabilities.practiceAppointmentsSupported,
  )
}
