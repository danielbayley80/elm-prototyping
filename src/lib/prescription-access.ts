import type { SourceCapabilities } from '../types/source-capabilities'

export interface PrescriptionsAccess {
  available: boolean
  canOrder: boolean
  disabledReason?: string
}

export function getPrescriptionsAccess(
  capabilities?: SourceCapabilities,
): PrescriptionsAccess {
  if (!capabilities) {
    return {
      available: false,
      canOrder: false,
      disabledReason: 'Connect a health source to view repeat prescriptions.',
    }
  }

  if (!capabilities.practiceRepeatPrescriptionsSupported) {
    return {
      available: false,
      canOrder: false,
      disabledReason: 'Your practice does not support online repeat prescriptions.',
    }
  }

  if (!capabilities.repeatPrescriptionsEnabled) {
    return {
      available: false,
      canOrder: false,
      disabledReason: 'Repeat prescriptions are not enabled for your account at this practice.',
    }
  }

  return { available: true, canOrder: true }
}

export function getPrimarySourceCapabilities(
  sources: { capabilities?: SourceCapabilities }[],
): SourceCapabilities | undefined {
  return sources.find((s) => s.capabilities)?.capabilities
}
