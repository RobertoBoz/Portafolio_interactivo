import { BOXES, CABINET, DESK, ROOM } from './layout'

/** Caja alineada a los ejes en el plano XZ. */
export type Box2 = {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export type Point2 = { x: number; z: number }

function boxAround(cx: number, cz: number, width: number, depth: number): Box2 {
  return {
    minX: cx - width / 2,
    maxX: cx + width / 2,
    minZ: cz - depth / 2,
    maxZ: cz + depth / 2,
  }
}

/** Obstáculos sólidos del cuarto. */
export const OBSTACLES: readonly Box2[] = [
  boxAround(DESK.position[0], DESK.position[2], DESK.width, DESK.depth),
  boxAround(CABINET.position[0], CABINET.position[2], CABINET.width, CABINET.depth),
  boxAround(BOXES.position[0], BOXES.position[2], 1.1, 0.9),
]

function circleHitsBox(p: Point2, radius: number, box: Box2): boolean {
  const closestX = Math.min(Math.max(p.x, box.minX), box.maxX)
  const closestZ = Math.min(Math.max(p.z, box.minZ), box.maxZ)
  const dx = p.x - closestX
  const dz = p.z - closestZ
  return dx * dx + dz * dz < radius * radius
}

function isBlocked(p: Point2, radius: number): boolean {
  if (p.x - radius < ROOM.minX || p.x + radius > ROOM.maxX) return true
  if (p.z - radius < ROOM.minZ || p.z + radius > ROOM.maxZ) return true
  return OBSTACLES.some((box) => circleHitsBox(p, radius, box))
}

/**
 * Mueve un círculo de `from` hacia `to` sin atravesar paredes ni obstáculos.
 * Resuelve cada eje por separado para que el personaje "se deslice" por las paredes.
 */
export function resolveMove(from: Point2, to: Point2, radius: number): Point2 {
  const result: Point2 = { x: from.x, z: from.z }

  const tryX: Point2 = { x: to.x, z: result.z }
  if (!isBlocked(tryX, radius)) result.x = to.x

  const tryZ: Point2 = { x: result.x, z: to.z }
  if (!isBlocked(tryZ, radius)) result.z = to.z

  return result
}
