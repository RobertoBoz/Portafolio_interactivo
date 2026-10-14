import type { KeyboardControlsEntry } from '@react-three/drei'

export type Control = 'forward' | 'backward' | 'left' | 'right'

/** Mapa de teclas para el movimiento tipo tanque. La tecla E se maneja aparte. */
export const KEY_MAP: KeyboardControlsEntry<Control>[] = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
]
