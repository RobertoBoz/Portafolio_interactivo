import type { PanelId } from '../content/portfolio'
import { DEV_MONITORS, PROJECTS } from '../content/portfolio'
import {
  DEV_LAYOUT,
  DOORS,
  LOBBY_LAYOUT,
  OFFICE_LAYOUT,
  RECEPTION_LAYOUT,
  ROOMS,
  otherSide,
  type RoomId,
} from './building'
import type { Point2 } from './collision'

export type Item = 'keycard'

export type InteractionAction =
  | { type: 'door'; doorId: string }
  | { type: 'panel'; panel: PanelId }
  | { type: 'message'; lines: string[] }
  | { type: 'pickup'; item: Item }

export type Interactable = {
  id: string
  room: RoomId
  point: Point2
  reach: number
  label: string
  action: InteractionAction
}

const doorInteractables: Interactable[] = DOORS.flatMap((door) =>
  door.rooms.map((room) => {
    const destination = ROOMS[otherSide(door, room)]
    return {
      id: `door:${door.id}:${room}`,
      room,
      point: { x: door.x, z: door.z },
      reach: 1.3,
      label: door.lock === 'soon' ? `Revisar puerta · ${destination.name}` : `Entrar · ${destination.name}`,
      action: { type: 'door', doorId: door.id } as const,
    }
  }),
)

export const INTERACTABLES: Interactable[] = [
  ...doorInteractables,
  {
    id: 'lobby:terminal',
    room: 'lobby',
    point: { x: LOBBY_LAYOUT.terminal[0], z: LOBBY_LAYOUT.terminal[2] },
    reach: 1.45,
    label: 'Usar terminal de recepción',
    action: { type: 'panel', panel: 'welcome' },
  },
  {
    id: 'lobby:entrance',
    room: 'lobby',
    point: { x: LOBBY_LAYOUT.entrance[0], z: LOBBY_LAYOUT.entrance[1] },
    reach: 1.3,
    label: 'Revisar la salida',
    action: { type: 'message', lines: ['Afuera solo hay oscuridad.', 'Todavía queda mucho por explorar.'] },
  },
  {
    id: 'recepcion:computer',
    room: 'recepcion',
    point: { x: RECEPTION_LAYOUT.computer[0], z: RECEPTION_LAYOUT.computer[1] },
    reach: 1.45,
    label: 'Usar computadora',
    action: { type: 'panel', panel: 'contact' },
  },
  {
    id: 'recepcion:keycard',
    room: 'recepcion',
    point: { x: RECEPTION_LAYOUT.keycard[0], z: RECEPTION_LAYOUT.keycard[1] },
    reach: 1.35,
    label: 'Tomar tarjeta de acceso',
    action: { type: 'pickup', item: 'keycard' },
  },
  ...DEV_LAYOUT.desks.map(([x, z], index): Interactable => {
    const projectId = DEV_MONITORS[index] ?? 'iteam'
    return {
      id: `desarrollo:monitor:${projectId}`,
      room: 'desarrollo',
      point: { x, z: z - 0.1 },
      reach: 1.5,
      label: `Ver proyecto · ${PROJECTS[projectId].name}`,
      action: { type: 'panel', panel: `project:${projectId}` },
    }
  }),
  {
    id: 'oficina:computer',
    room: 'oficina',
    point: { x: OFFICE_LAYOUT.computer[0], z: OFFICE_LAYOUT.computer[1] },
    reach: 1.5,
    label: 'Usar computadora',
    action: { type: 'panel', panel: 'about' },
  },
  {
    id: 'oficina:expediente',
    room: 'oficina',
    point: { x: OFFICE_LAYOUT.shelf.center[0], z: OFFICE_LAYOUT.shelf.center[1] },
    reach: 1.3,
    label: 'Revisar expediente',
    action: { type: 'panel', panel: 'cv' },
  },
]

const BY_ID = new Map(INTERACTABLES.map((item) => [item.id, item]))

export function interactableById(id: string): Interactable | undefined {
  return BY_ID.get(id)
}

/**
 * Objeto interactuable más cercano del cuarto actual que esté al alcance
 * y aproximadamente frente al personaje. `skip` descarta objetos (p. ej. la tarjeta ya tomada).
 */
export function findNearbyInteraction(
  room: RoomId,
  position: Point2,
  heading: number,
  skip: (item: Interactable) => boolean,
): Interactable | null {
  const forwardX = Math.sin(heading)
  const forwardZ = Math.cos(heading)
  let best: Interactable | null = null
  let bestDistance = Infinity

  for (const item of INTERACTABLES) {
    if (item.room !== room || skip(item)) continue
    const dx = item.point.x - position.x
    const dz = item.point.z - position.z
    const distance = Math.hypot(dx, dz)
    if (distance > item.reach || distance < 1e-4) continue
    if ((dx * forwardX + dz * forwardZ) / distance < 0.35) continue
    if (distance < bestDistance) {
      best = item
      bestDistance = distance
    }
  }
  return best
}
