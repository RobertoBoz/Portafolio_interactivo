import { useEffect } from 'react'
import { hasOverlay, isPaused, useGameStore } from '../store/gameStore'

/**
 * E: interactuar o cerrar. M: plano. I: índice. Esc: cerrar o pausar.
 */
export function useInteractionKeys(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      const state = useGameStore.getState()
      // No interceptar teclas mientras se escribe en un control de formulario.
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return
      const open = hasOverlay(state)

      switch (event.code) {
        case 'KeyE':
          if (open) state.close()
          else state.interact()
          return
        case 'KeyM':
          if (state.started) state.toggleMap()
          return
        case 'KeyI':
          if (state.indexOpen) state.close()
          else if (!state.panel && !state.message) state.openIndex()
          return
        case 'Escape':
          if (open) state.close()
          else if (state.started && state.settings.cameraMode === 'classic') state.setPaused(!isPaused(state))
          return
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
