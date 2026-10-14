/**
 * Fuente única de verdad para la distribución del cuarto.
 * Unidades en metros. El eje Y es vertical; el piso está en y = 0.
 */

export type Vec3 = [number, number, number]

/** Límites interiores del cuarto (plano XZ). */
export const ROOM = {
  minX: -5,
  maxX: 5,
  minZ: -4,
  maxZ: 4,
  height: 3.2,
} as const

/** Cámara fija colocada en la esquina frontal derecha, cerca del techo. */
export const CAMERA = {
  position: [4.5, 2.9, 3.5] as Vec3,
  target: [-1, 0.6, -1] as Vec3,
  fov: 58,
} as const

export const DESK = {
  position: [-4.35, 0, 0.2] as Vec3,
  width: 1.1, // eje X
  depth: 2.0, // eje Z
  height: 0.78,
} as const

/** El monitor está sobre la mesa y mira hacia +X (hacia el centro del cuarto). */
export const MONITOR = {
  position: [-4.45, DESK.height, 0.2] as Vec3,
  rotationY: Math.PI / 2,
} as const

/** La puerta está en la pared del fondo (z = minZ) y mira hacia +Z. */
export const DOOR = {
  position: [1.6, 0, ROOM.minZ] as Vec3,
  width: 1.1,
  height: 2.2,
} as const

export const LAMP = {
  position: [-0.6, ROOM.height - 0.06, -0.4] as Vec3,
} as const

export const CABINET = {
  position: [4.4, 0, -3.55] as Vec3,
  width: 0.9,
  depth: 0.6,
  height: 1.35,
} as const

export const BOXES = {
  position: [-4.2, 0, -3.3] as Vec3,
} as const

export const CHARACTER = {
  start: [1.6, 0, 1.4] as Vec3,
  /** Rumbo inicial en radianes: PI = mirando hacia la puerta (-Z). */
  startHeading: Math.PI,
  radius: 0.32,
  walkSpeed: 1.45,
  backSpeed: 0.85,
  turnSpeed: 1.9,
} as const
