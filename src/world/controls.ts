import type { KeyboardControlsEntry } from '@react-three/drei'

export type Control = 'forward' | 'backward' | 'strafeLeft' | 'strafeRight' | 'turnLeft' | 'turnRight'

/**
 * Primera persona: W/S avanzan, A/D se desplazan de lado, flechas izquierda/derecha giran.
 * Cámara clásica: A/D y las flechas giran (control tipo tanque).
 * E, M y Esc se manejan aparte.
 */
export const KEY_MAP: KeyboardControlsEntry<Control>[] = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'strafeLeft', keys: ['KeyA'] },
  { name: 'strafeRight', keys: ['KeyD'] },
  { name: 'turnLeft', keys: ['ArrowLeft'] },
  { name: 'turnRight', keys: ['ArrowRight'] },
]
