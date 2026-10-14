import { useEffect } from 'react'
import { hasOverlay, useGameStore } from '../store/gameStore'
import { exitPointerLock, requestPointerLock } from '../world/pointerLock'

/**
 * Sincroniza la captura del ratón con el juego en primera persona:
 * se suelta al abrir cualquier ventana y se recupera al cerrarla.
 */
export function usePointerLockSync(): void {
  useEffect(() => {
    const onChange = () => useGameStore.getState().setPointerLocked(document.pointerLockElement !== null)
    document.addEventListener('pointerlockchange', onChange)

    const unsubscribe = useGameStore.subscribe((state, previous) => {
      if (state.settings.cameraMode !== 'firstPerson' || !state.started) {
        if (state.settings.cameraMode !== 'firstPerson') exitPointerLock()
        return
      }
      const open = hasOverlay(state)
      const wasOpen = hasOverlay(previous)
      if (open && !wasOpen) exitPointerLock()
      // Al cerrar una ventana, o al entrar, se intenta recuperar el ratón (requiere un gesto del usuario).
      if ((!open && wasOpen) || (state.started && !previous.started)) requestPointerLock()
    })

    return () => {
      document.removeEventListener('pointerlockchange', onChange)
      unsubscribe()
    }
  }, [])
}
