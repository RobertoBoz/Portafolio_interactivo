/** Ajustes del jugador, guardados en el navegador. */

export type CameraMode = 'firstPerson' | 'classic'
export type Resolution = 'low' | 'medium' | 'high'

export type Settings = {
  cameraMode: CameraMode
  /** Líneas verticales del render interno. */
  resolution: Resolution
  /** Temblor de vértices estilo PS1. */
  vertexSnap: boolean
  /** Scanlines y viñeta sobre la pantalla. */
  screenEffects: boolean
  /** Sensibilidad del ratón en primera persona (1 = normal). */
  mouseSensitivity: number
}

export const RESOLUTION_LINES: Record<Resolution, number> = { low: 240, medium: 360, high: 540 }

export const DEFAULT_SETTINGS: Settings = {
  cameraMode: 'firstPerson',
  resolution: 'medium',
  vertexSnap: true,
  screenEffects: true,
  mouseSensitivity: 1,
}

const KEY = 'portafolio-ps1:ajustes'

export function loadSettings(): Settings {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    // Sin almacenamiento disponible (modo privado, etc.): los ajustes duran solo esta visita.
  }
}
