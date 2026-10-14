/**
 * Planta baja de la oficina de desarrollo. Fuente única de verdad para
 * cuartos, puertas, cámaras, muebles sólidos y puntos de interacción.
 *
 * Unidades en metros. X crece hacia el este y Z hacia el sur (la entrada).
 * El piso está en y = 0.
 */

export type Vec3 = [number, number, number]
export type Rect = { minX: number; maxX: number; minZ: number; maxZ: number }

export type RoomId =
  | 'lobby'
  | 'recepcion'
  | 'oficina'
  | 'desarrollo'
  | 'juntas'
  | 'comedor'
  | 'servidores'
  | 'banos'
  | 'almacen'
  | 'diseno'
  | 'rh'

export type CameraShot = { position: Vec3; target: Vec3; fov: number }

/** Una cámara fija que se activa mientras el personaje está dentro de `zone`. */
export type CameraZone = { zone: Rect; shot: CameraShot }

export type RoomDef = {
  id: RoomId
  number: number
  name: string
  rect: Rect
  /** false = todavía no se construye; su puerta queda cerrada. */
  built: boolean
  cameras: CameraZone[]
  /** Muebles sólidos (cajas en el plano XZ). */
  obstacles: Rect[]
}

export const WALL_HEIGHT = 3.2

export const CHARACTER = {
  radius: 0.32,
  walkSpeed: 1.45,
  backSpeed: 0.85,
  turnSpeed: 1.9,
} as const

export function rectAround(cx: number, cz: number, width: number, depth: number): Rect {
  return { minX: cx - width / 2, maxX: cx + width / 2, minZ: cz - depth / 2, maxZ: cz + depth / 2 }
}

export function rectCenter(rect: Rect): { x: number; z: number } {
  return { x: (rect.minX + rect.maxX) / 2, z: (rect.minZ + rect.maxZ) / 2 }
}

/* ------------------------------ Muebles por cuarto ------------------------------ */

export const LOBBY_LAYOUT = {
  desk: { center: [0, -7.2] as [number, number], radius: 3.6 },
  terminal: [0, 0, -3.95] as Vec3,
  sofas: [
    [-2.4, 6],
    [2.4, 6],
  ] as [number, number][],
  coffeeTable: [0, 6] as [number, number],
  deskPlants: [
    [-3.05, -2.9],
    [3.05, -2.9],
  ] as [number, number][],
  planters: [
    [-4.3, 11.3],
    [4.3, 11.3],
  ] as [number, number][],
  entrance: [0, 12] as [number, number],
} as const

export const RECEPTION_LAYOUT = {
  desk: { center: [-8.6, 9.75] as [number, number], width: 2.6, depth: 0.75 },
  computer: [-9.3, 9.65] as [number, number],
  keycard: [-7.75, 9.85] as [number, number],
  sofa: [-9.4, 12.45] as [number, number],
  plant: [-10.5, 9.5] as [number, number],
} as const

export const DEV_LAYOUT = {
  /** Escritorios: dos filas de tres. El monitor mira hacia el sur (+Z). */
  desks: [
    [-12.6, -2.7],
    [-10.2, -2.7],
    [-7.8, -2.7],
    [-12.6, 0.5],
    [-10.2, 0.5],
    [-7.8, 0.5],
  ] as [number, number][],
  deskSize: { width: 1.8, depth: 0.8 },
  plants: [
    [-14.4, -4.4],
    [-14.4, 2.4],
  ] as [number, number][],
} as const

export const OFFICE_LAYOUT = {
  desk: { center: [-12, 6] as [number, number], width: 0.9, depth: 2.0 },
  computer: [-12.15, 6.3] as [number, number],
  shelf: { center: [-9.2, 3.25] as [number, number], width: 1.8, depth: 0.45 },
  plant: [-14.4, 8.4] as [number, number],
  armchair: [-7.2, 8.25] as [number, number],
} as const

/* ----------------------------------- Cuartos ----------------------------------- */

const lobbyDesk = rectAround(0, -5.25, 6.6, 3.9)

export const ROOMS: Record<RoomId, RoomDef> = {
  lobby: {
    id: 'lobby',
    number: 1,
    name: 'Lobby principal',
    rect: { minX: -5, maxX: 5, minZ: -7, maxZ: 12 },
    built: true,
    cameras: [
      {
        zone: { minX: -5, maxX: 5, minZ: -7, maxZ: 2.5 },
        shot: { position: [-4.3, 3.2, 2.8], target: [1.2, 0.8, -4.4], fov: 60 },
      },
      {
        zone: { minX: -5, maxX: 5, minZ: 2.5, maxZ: 12 },
        shot: { position: [4.3, 3.1, 11.4], target: [-0.9, 0.8, 3.4], fov: 60 },
      },
    ],
    obstacles: [
      lobbyDesk,
      ...LOBBY_LAYOUT.deskPlants.map(([x, z]) => rectAround(x, z, 0.6, 0.6)),
      ...LOBBY_LAYOUT.sofas.map(([x, z]) => rectAround(x, z, 0.9, 2.1)),
      rectAround(LOBBY_LAYOUT.coffeeTable[0], LOBBY_LAYOUT.coffeeTable[1], 1.1, 0.8),
      ...LOBBY_LAYOUT.planters.map(([x, z]) => rectAround(x, z, 0.8, 0.8)),
    ],
  },
  recepcion: {
    id: 'recepcion',
    number: 2,
    name: 'Recepción',
    rect: { minX: -11, maxX: -5, minZ: 9, maxZ: 13 },
    built: true,
    cameras: [
      {
        zone: { minX: -11, maxX: -5, minZ: 9, maxZ: 13 },
        shot: { position: [-5.4, 2.8, 12.6], target: [-9.2, 0.6, 10.1], fov: 62 },
      },
    ],
    obstacles: [
      rectAround(RECEPTION_LAYOUT.desk.center[0], RECEPTION_LAYOUT.desk.center[1], RECEPTION_LAYOUT.desk.width, RECEPTION_LAYOUT.desk.depth + 0.4),
      rectAround(RECEPTION_LAYOUT.sofa[0], RECEPTION_LAYOUT.sofa[1], 2.0, 0.8),
      rectAround(RECEPTION_LAYOUT.plant[0], RECEPTION_LAYOUT.plant[1], 0.6, 0.6),
    ],
  },
  oficina: {
    id: 'oficina',
    number: 3,
    name: 'Oficina privada',
    rect: { minX: -15, maxX: -5, minZ: 3, maxZ: 9 },
    built: true,
    cameras: [
      {
        zone: { minX: -15, maxX: -5, minZ: 3, maxZ: 9 },
        shot: { position: [-5.5, 2.9, 8.6], target: [-11, 0.6, 5.1], fov: 60 },
      },
    ],
    obstacles: [
      rectAround(OFFICE_LAYOUT.desk.center[0] - 0.2, OFFICE_LAYOUT.desk.center[1], OFFICE_LAYOUT.desk.width + 0.8, OFFICE_LAYOUT.desk.depth),
      rectAround(OFFICE_LAYOUT.shelf.center[0], OFFICE_LAYOUT.shelf.center[1], OFFICE_LAYOUT.shelf.width, OFFICE_LAYOUT.shelf.depth),
      rectAround(OFFICE_LAYOUT.plant[0], OFFICE_LAYOUT.plant[1], 0.6, 0.6),
      rectAround(OFFICE_LAYOUT.armchair[0], OFFICE_LAYOUT.armchair[1], 0.9, 0.9),
    ],
  },
  desarrollo: {
    id: 'desarrollo',
    number: 4,
    name: 'Desarrollo',
    rect: { minX: -15, maxX: -5, minZ: -5, maxZ: 3 },
    built: true,
    cameras: [
      {
        zone: { minX: -15, maxX: -5, minZ: -5, maxZ: 3 },
        shot: { position: [-5.5, 3.0, 2.6], target: [-10.8, 0.6, -1.8], fov: 62 },
      },
    ],
    obstacles: [
      // El escritorio más la silla del lado sur.
      ...DEV_LAYOUT.desks.map(([x, z]) => rectAround(x, z + 0.15, DEV_LAYOUT.deskSize.width, DEV_LAYOUT.deskSize.depth + 0.3)),
      ...DEV_LAYOUT.plants.map(([x, z]) => rectAround(x, z, 0.6, 0.6)),
    ],
  },
  juntas: placeholder('juntas', 5, 'Sala de juntas', { minX: -15, maxX: -5, minZ: -13, maxZ: -5 }),
  comedor: placeholder('comedor', 6, 'Comedor / Descanso', { minX: -5, maxX: 5, minZ: -13, maxZ: -7 }),
  servidores: placeholder('servidores', 7, 'Sala de servidores', { minX: 5, maxX: 15, minZ: -13, maxZ: -5 }),
  banos: placeholder('banos', 8, 'Baños', { minX: 5, maxX: 15, minZ: -5, maxZ: -1 }),
  almacen: placeholder('almacen', 9, 'Almacén', { minX: 5, maxX: 15, minZ: -1, maxZ: 3 }),
  diseno: placeholder('diseno', 10, 'Diseño UX/UI', { minX: 5, maxX: 15, minZ: 3, maxZ: 9 }),
  rh: placeholder('rh', 11, 'Recursos humanos', { minX: 5, maxX: 11, minZ: 9, maxZ: 13 }),
}

function placeholder(id: RoomId, number: number, name: string, rect: Rect): RoomDef {
  return { id, number, name, rect, built: false, cameras: [], obstacles: [] }
}

export const ROOM_LIST: RoomDef[] = Object.values(ROOMS).sort((a, b) => a.number - b.number)

/* ----------------------------------- Puertas ----------------------------------- */

export type DoorLock = 'none' | 'keycard' | 'soon'

export type DoorDef = {
  id: string
  rooms: [RoomId, RoomId]
  x: number
  z: number
  /** 'x' = la puerta está en una pared con X constante (este/oeste). */
  axis: 'x' | 'z'
  lock: DoorLock
}

export const DOORS: DoorDef[] = [
  { id: 'lobby-recepcion', rooms: ['lobby', 'recepcion'], x: -5, z: 10.5, axis: 'x', lock: 'none' },
  { id: 'lobby-oficina', rooms: ['lobby', 'oficina'], x: -5, z: 6, axis: 'x', lock: 'keycard' },
  { id: 'lobby-desarrollo', rooms: ['lobby', 'desarrollo'], x: -5, z: -1, axis: 'x', lock: 'none' },
  { id: 'lobby-juntas', rooms: ['lobby', 'juntas'], x: -5, z: -6.1, axis: 'x', lock: 'soon' },
  { id: 'lobby-comedor', rooms: ['lobby', 'comedor'], x: -3.9, z: -7, axis: 'z', lock: 'soon' },
  { id: 'lobby-servidores', rooms: ['lobby', 'servidores'], x: 5, z: -6.1, axis: 'x', lock: 'soon' },
  { id: 'lobby-banos', rooms: ['lobby', 'banos'], x: 5, z: -3, axis: 'x', lock: 'soon' },
  { id: 'lobby-almacen', rooms: ['lobby', 'almacen'], x: 5, z: 1, axis: 'x', lock: 'soon' },
  { id: 'lobby-diseno', rooms: ['lobby', 'diseno'], x: 5, z: 6, axis: 'x', lock: 'soon' },
  { id: 'lobby-rh', rooms: ['lobby', 'rh'], x: 5, z: 10.5, axis: 'x', lock: 'soon' },
]

export const DOOR_SIZE = { width: 1.1, height: 2.2 } as const

export function doorsOf(roomId: RoomId): DoorDef[] {
  return DOORS.filter((door) => door.rooms.includes(roomId))
}

export function otherSide(door: DoorDef, roomId: RoomId): RoomId {
  return door.rooms[0] === roomId ? door.rooms[1] : door.rooms[0]
}

/** Normal de la puerta que apunta hacia el interior de `roomId`. */
export function doorNormal(door: DoorDef, roomId: RoomId): { x: number; z: number } {
  const center = rectCenter(ROOMS[roomId].rect)
  if (door.axis === 'x') return { x: center.x < door.x ? -1 : 1, z: 0 }
  return { x: 0, z: center.z < door.z ? -1 : 1 }
}

/** Dónde aparece el personaje al cruzar `door` hacia `roomId`, mirando hacia dentro. */
export function spawnThrough(door: DoorDef, roomId: RoomId): { x: number; z: number; heading: number } {
  const normal = doorNormal(door, roomId)
  return {
    x: door.x + normal.x * 0.85,
    z: door.z + normal.z * 0.85,
    heading: Math.atan2(normal.x, normal.z),
  }
}

/* ---------------------------------- Inicio ---------------------------------- */

export const START = { room: 'lobby' as RoomId, x: 0, z: 10.6, heading: Math.PI }

export function cameraFor(roomId: RoomId, x: number, z: number): CameraShot | null {
  const room = ROOMS[roomId]
  const inside = room.cameras.find(
    ({ zone }) => x >= zone.minX && x <= zone.maxX && z >= zone.minZ && z <= zone.maxZ,
  )
  return (inside ?? room.cameras[0])?.shot ?? null
}
