import type { Interaction } from '../store/gameStore'
import { DOOR, MONITOR } from './layout'
import type { Point2 } from './collision'

type Interactable = {
  id: Interaction
  point: Point2
  reach: number
  label: string
}

export const INTERACTABLES: readonly Interactable[] = [
  {
    id: 'monitor',
    point: { x: MONITOR.position[0], z: MONITOR.position[2] },
    reach: 1.45,
    label: 'Inspeccionar monitor',
  },
  {
    id: 'door',
    point: { x: DOOR.position[0], z: DOOR.position[2] },
    reach: 1.25,
    label: 'Revisar puerta',
  },
]

export function labelFor(id: Interaction): string {
  return INTERACTABLES.find((item) => item.id === id)?.label ?? ''
}

/**
 * Devuelve el objeto interactuable más cercano que esté al alcance
 * y aproximadamente frente al personaje.
 */
export function findNearbyInteraction(position: Point2, heading: number): Interaction | null {
  const forwardX = Math.sin(heading)
  const forwardZ = Math.cos(heading)

  let best: Interaction | null = null
  let bestDistance = Infinity

  for (const item of INTERACTABLES) {
    const dx = item.point.x - position.x
    const dz = item.point.z - position.z
    const distance = Math.hypot(dx, dz)
    if (distance > item.reach || distance < 1e-4) continue

    const facing = (dx * forwardX + dz * forwardZ) / distance
    if (facing < 0.35) continue

    if (distance < bestDistance) {
      best = item.id
      bestDistance = distance
    }
  }

  return best
}
