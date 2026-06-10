import type { ShareActivation } from '../../types/health-sharing'
import { shareActivationLabels } from '../../types/health-sharing'

export function ShareActivationLabel({ activation }: { activation: ShareActivation }) {
  return <>{shareActivationLabels[activation]}</>
}
