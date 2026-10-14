import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

/**
 * E: interactuar o cerrar lo que esté abierto.
 * M: abrir o cerrar el mapa. Escape: cerrar.
 */
export function useInteractionKeys(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      const state = useGameStore.getState()
      const somethingOpen = state.panel !== null || state.message !== null || state.mapOpen

      if (event.code === 'KeyE') {
        if (somethingOpen) state.close()
        else state.interact()
      } else if (event.code === 'KeyM') {
        state.toggleMap()
      } else if (event.code === 'Escape' && somethingOpen) {
        state.close()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
