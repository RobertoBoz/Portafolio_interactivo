import { useGameStore } from '../../store/gameStore'
import { ControlsHint } from './ControlsHint'
import { DoorMessage } from './DoorMessage'
import { InteractionPrompt } from './InteractionPrompt'
import { MonitorScreen } from './MonitorScreen'

/** Capa HTML sobre el canvas: ayudas, indicador de interacción y diálogos. */
export function Hud() {
  const active = useGameStore((state) => state.activeInteraction)

  return (
    <div className="hud">
      <ControlsHint />
      <InteractionPrompt />
      {active === 'monitor' && <MonitorScreen />}
      {active === 'door' && <DoorMessage />}
    </div>
  )
}
