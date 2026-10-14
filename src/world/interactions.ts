import { PROJECTS, STACK, type PanelId } from '../content/portfolio'
import {
  ARCHIVE_LAYOUT,
  BREAK_LAYOUT,
  DEV_LAYOUT,
  DOORS,
  LAB_LAYOUT,
  LOBBY_LAYOUT,
  MEETING_LAYOUT,
  OFFICE_LAYOUT,
  RECEPTION_LAYOUT,
  ROOMS,
  SERVER_LAYOUT,
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
  | { type: 'map' }

export type InteractionKind = 'door' | 'terminal' | 'document' | 'object' | 'item'

/**
 * Objeto interactuable. Todo el sistema de interacción se alimenta de esta lista:
 * detección, indicador "E — …", índice accesible y paneles.
 */
export type Interactable = {
  id: string
  room: RoomId
  /** Nombre visible del objeto. */
  name: string
  kind: InteractionKind
  /** Texto de ayuda del indicador. */
  label: string
  point: Point2
  reach: number
  action: InteractionAction
}

const doorInteractables: Interactable[] = DOORS.flatMap((door) =>
  door.rooms.map((room): Interactable => {
    const destination = ROOMS[otherSide(door, room)]
    return {
      id: `door:${door.id}:${room}`,
      room,
      name: `Puerta · ${destination.name}`,
      kind: 'door',
      point: { x: door.x, z: door.z },
      reach: 1.4,
      label: door.lock === 'soon' ? `Revisar puerta · ${destination.name}` : `Abrir puerta · ${destination.name}`,
      action: { type: 'door', doorId: door.id },
    }
  }),
)

function panel(
  room: RoomId,
  id: string,
  name: string,
  kind: InteractionKind,
  label: string,
  [x, z]: readonly [number, number],
  panelId: PanelId,
  reach = 1.45,
): Interactable {
  return { id: `${room}:${id}`, room, name, kind, label, point: { x, z }, reach, action: { type: 'panel', panel: panelId } }
}

export const INTERACTABLES: Interactable[] = [
  ...doorInteractables,

  // Lobby
  panel('lobby', 'terminal', 'Terminal del lobby', 'terminal', 'Usar terminal', [LOBBY_LAYOUT.terminal[0], LOBBY_LAYOUT.terminal[2]], 'welcome'),
  {
    id: 'lobby:entrance',
    room: 'lobby',
    name: 'Entrada principal',
    kind: 'object',
    label: 'Revisar la salida',
    point: { x: LOBBY_LAYOUT.entrance[0], z: LOBBY_LAYOUT.entrance[1] },
    reach: 1.4,
    action: { type: 'message', lines: ['Afuera solo hay oscuridad.', 'Todavía queda mucho por explorar.'] },
  },

  {
    id: 'lobby:directorio',
    room: 'lobby',
    name: 'Directorio',
    kind: 'object',
    label: 'Consultar directorio',
    point: { x: LOBBY_LAYOUT.directory[0], z: LOBBY_LAYOUT.directory[1] },
    reach: 1.5,
    action: { type: 'map' },
  },

  // Recepción
  panel('recepcion', 'computer', 'Computadora de recepción', 'terminal', 'Usar computadora', RECEPTION_LAYOUT.computer, 'intro'),
  panel('recepcion', 'tarjetero', 'Tarjetas de presentación', 'document', 'Tomar tarjeta de presentación', RECEPTION_LAYOUT.businessCards, 'contact', 1.4),
  {
    id: 'recepcion:keycard',
    room: 'recepcion',
    name: 'Tarjeta de acceso',
    kind: 'item',
    label: 'Tomar tarjeta de acceso',
    point: { x: RECEPTION_LAYOUT.keycard[0], z: RECEPTION_LAYOUT.keycard[1] },
    reach: 1.35,
    action: { type: 'pickup', item: 'keycard' },
  },

  // Oficina privada
  panel('oficina', 'computer', 'Computadora personal', 'terminal', 'Usar computadora', OFFICE_LAYOUT.computer, 'about', 1.5),
  panel('oficina', 'expediente', 'Expediente', 'document', 'Revisar expediente', OFFICE_LAYOUT.shelf.center, 'cv', 1.3),

  // Desarrollo: un escritorio por categoría del stack
  ...DEV_LAYOUT.desks.map(([x, z], i): Interactable => {
    const group = STACK[i] ?? STACK[0]!
    return panel('desarrollo', `stack:${group.id}`, group.title, 'terminal', `Ver · ${group.title}`, [x, z - 0.1], `stack:${group.id}`, 1.5)
  }),

  // Sala de juntas
  panel('juntas', 'proyector', 'Proyector', 'document', 'Ver presentación', MEETING_LAYOUT.projector, 'juntas:experiencia', 1.7),
  panel('juntas', 'pizarron', 'Pizarrón', 'document', 'Leer pizarrón', MEETING_LAYOUT.whiteboard, 'juntas:equipo', 1.5),

  // Comedor
  panel('comedor', 'corcho', 'Tablero de corcho', 'document', 'Leer tablero', BREAK_LAYOUT.corkboard, 'comedor:pizarron', 1.5),
  {
    id: 'comedor:cafe',
    room: 'comedor',
    name: 'Cafetera',
    kind: 'object',
    label: 'Revisar cafetera',
    point: { x: BREAK_LAYOUT.coffee[0], z: BREAK_LAYOUT.coffee[1] },
    reach: 1.4,
    action: { type: 'message', lines: ['La cafetera sigue tibia.', 'Alguien trabajó hasta tarde.'] },
  },

  // Sala de servidores
  ...SERVER_LAYOUT.racks.map(([x, z], i): Interactable => {
    const ids = ['cicd', 'calidad', 'operacion', 'automatizacion'] as const
    const names = ['CI/CD', 'Calidad y seguridad', 'Operación', 'Automatización']
    const id = ids[i] ?? 'cicd'
    const name = `Rack · ${names[i] ?? ''}`
    return panel('servidores', id, name, 'terminal', `Revisar ${name}`, [x, z], `servidores:${id}`, 1.6)
  }),

  // Archivo de proyectos
  ...ARCHIVE_LAYOUT.cabinets.map(([x, z], i): Interactable => {
    const project = PROJECTS[i] ?? PROJECTS[0]!
    return panel('almacen', project.id, project.name, 'document', `Abrir archivero · ${project.name}`, [x, z], `project:${project.id}`, 1.25)
  }),

  // Laboratorio técnico
  panel('diseno', 'pizarron', 'Pizarrón de arquitectura', 'document', 'Leer pizarrón', LAB_LAYOUT.whiteboard, 'lab:arquitectura', 1.5),
  panel('diseno', 'terminal', 'Terminal del laboratorio', 'terminal', 'Usar terminal', LAB_LAYOUT.terminal, 'lab:decisiones', 1.45),
  panel('diseno', 'banco', 'Banco de pruebas', 'object', 'Revisar banco de pruebas', LAB_LAYOUT.bench.center, 'lab:experimentos', 1.6),
]

const BY_ID = new Map(INTERACTABLES.map((item) => [item.id, item]))

export function interactableById(id: string): Interactable | undefined {
  return BY_ID.get(id)
}

/**
 * Objeto interactuable más cercano del cuarto actual que esté al alcance y
 * frente al jugador. `minFacing` es el coseno mínimo del ángulo de visión.
 */
export function findNearbyInteraction(
  room: RoomId,
  position: Point2,
  heading: number,
  skip: (item: Interactable) => boolean,
  minFacing = 0.35,
): Interactable | null {
  const forwardX = Math.sin(heading)
  const forwardZ = Math.cos(heading)
  let best: Interactable | null = null
  let bestScore = Infinity

  for (const item of INTERACTABLES) {
    if (item.room !== room || skip(item)) continue
    const dx = item.point.x - position.x
    const dz = item.point.z - position.z
    const distance = Math.hypot(dx, dz)
    if (distance > item.reach || distance < 1e-4) continue
    const facing = (dx * forwardX + dz * forwardZ) / distance
    if (facing < minFacing) continue
    // Prioriza lo que está más al centro de la vista y luego lo más cercano.
    const score = distance * (2 - facing)
    if (score < bestScore) {
      best = item
      bestScore = score
    }
  }
  return best
}
