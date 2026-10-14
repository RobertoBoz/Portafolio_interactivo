/** Captura del ratón para la primera persona. */

export function requestPointerLock(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('.game-canvas canvas')
  if (!canvas || document.pointerLockElement === canvas) return
  try {
    const result = canvas.requestPointerLock() as unknown
    // En navegadores recientes devuelve una promesa que puede rechazarse sin gesto del usuario.
    if (result instanceof Promise) result.catch(() => undefined)
  } catch {
    // Se mostrará la pantalla de pausa con "Haz clic para continuar".
  }
}

export function exitPointerLock(): void {
  if (document.pointerLockElement) document.exitPointerLock()
}
