import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

/**
 * E abre la interacción con el objeto cercano o cierra la que esté abierta.
 * Escape también cierra.
 */
export function useInteractionKeys(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      const { isInteracting, nearbyInteraction, setInteraction } = useGameStore.getState()

      if (event.code === 'KeyE') {
        if (isInteracting) setInteraction(null)
        else if (nearbyInteraction) setInteraction(nearbyInteraction)
      } else if (event.code === 'Escape' && isInteracting) {
        setInteraction(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
