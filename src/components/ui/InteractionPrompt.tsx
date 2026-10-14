import { isBusy, useGameStore } from '../../store/gameStore'
import { interactableById } from '../../world/interactions'

/** Indicador "[E] ..." cuando el personaje está frente a algo con lo que puede interactuar. */
export function InteractionPrompt() {
  const nearby = useGameStore((state) => state.nearby)
  const busy = useGameStore(isBusy)
  const label = nearby ? interactableById(nearby)?.label : null

  if (!label || busy) return null

  return (
    <div className="prompt" role="status">
      <kbd>E</kbd> {label}
    </div>
  )
}
