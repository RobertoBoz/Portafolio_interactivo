import { useGameStore } from '../../store/gameStore'
import { labelFor } from '../../world/interactions'

/** Indicador "[E] ..." cuando el personaje está frente a algo con lo que puede interactuar. */
export function InteractionPrompt() {
  const nearby = useGameStore((state) => state.nearbyInteraction)
  const isInteracting = useGameStore((state) => state.isInteracting)

  if (!nearby || isInteracting) return null

  return (
    <div className="prompt" role="status">
      <kbd>E</kbd> {labelFor(nearby)}
    </div>
  )
}
