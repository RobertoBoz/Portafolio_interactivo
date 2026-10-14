import { ROOMS, type Rect, type RoomId } from './building'

export type Point2 = { x: number; z: number }

function circleHitsRect(p: Point2, radius: number, rect: Rect): boolean {
  const closestX = Math.min(Math.max(p.x, rect.minX), rect.maxX)
  const closestZ = Math.min(Math.max(p.z, rect.minZ), rect.maxZ)
  const dx = p.x - closestX
  const dz = p.z - closestZ
  return dx * dx + dz * dz < radius * radius
}

function isBlocked(roomId: RoomId, p: Point2, radius: number): boolean {
  const { rect, obstacles } = ROOMS[roomId]
  if (p.x - radius < rect.minX || p.x + radius > rect.maxX) return true
  if (p.z - radius < rect.minZ || p.z + radius > rect.maxZ) return true
  return obstacles.some((obstacle) => circleHitsRect(p, radius, obstacle))
}

/**
 * Mueve un círculo de `from` hacia `to` dentro de un cuarto sin atravesar
 * paredes ni muebles. Cada eje se resuelve por separado para deslizarse por las paredes.
 */
export function resolveMove(roomId: RoomId, from: Point2, to: Point2, radius: number): Point2 {
  const result: Point2 = { x: from.x, z: from.z }
  if (!isBlocked(roomId, { x: to.x, z: result.z }, radius)) result.x = to.x
  if (!isBlocked(roomId, { x: result.x, z: to.z }, radius)) result.z = to.z
  return result
}
