import { create } from 'zustand'
import type { PanelId } from '../content/portfolio'
import { DOORS, ROOMS, START, doorsOf, otherSide, spawnThrough, type RoomId } from '../world/building'
import { interactableById, type Item } from '../world/interactions'

const FADE_MS = 380

type Spawn = { room: RoomId; x: number; z: number; heading: number; version: number }

type GameState = {
  room: RoomId
  visited: RoomId[]
  items: Item[]
  unlockedDoors: string[]
  /** Id del objeto interactuable al alcance. Lo actualiza el personaje. */
  nearby: string | null
  panel: PanelId | null
  message: string[] | null
  mapOpen: boolean
  /** true durante el fundido a negro al cruzar una puerta. */
  transitioning: boolean
  /** Cambia cuando el personaje debe aparecer en otro lugar (cruzar una puerta). */
  spawn: Spawn

  setNearby: (id: string | null) => void
  interact: () => void
  close: () => void
  toggleMap: () => void
}

/** Mientras haya algo abierto o una transición, el personaje no se mueve. */
export function isBusy(state: GameState): boolean {
  return state.panel !== null || state.message !== null || state.mapOpen || state.transitioning
}

function initialSpawn(): Spawn {
  // ?sala=desarrollo permite empezar en un cuarto construido (útil para enlaces y pruebas).
  const requested = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('sala')
  const room = requested && requested in ROOMS ? (requested as RoomId) : null
  if (room && room !== 'lobby' && ROOMS[room].built) {
    const door = doorsOf(room).find((d) => otherSide(d, room) === 'lobby')
    if (door) return { room, ...spawnThrough(door, room), version: 0 }
  }
  return { room: START.room, x: START.x, z: START.z, heading: START.heading, version: 0 }
}

const firstSpawn = initialSpawn()

export const useGameStore = create<GameState>()((set, get) => ({
  room: firstSpawn.room,
  visited: [firstSpawn.room],
  items: [],
  unlockedDoors: [],
  nearby: null,
  panel: null,
  message: null,
  mapOpen: false,
  transitioning: false,
  spawn: firstSpawn,

  setNearby: (id) => set({ nearby: id }),

  close: () => set({ panel: null, message: null, mapOpen: false }),

  toggleMap: () => {
    const state = get()
    if (state.transitioning || state.panel || state.message) return
    set({ mapOpen: !state.mapOpen })
  },

  interact: () => {
    const state = get()
    if (isBusy(state) || !state.nearby) return
    const target = interactableById(state.nearby)
    if (!target) return
    const { action } = target

    switch (action.type) {
      case 'panel':
        set({ panel: action.panel })
        return
      case 'message':
        set({ message: action.lines })
        return
      case 'pickup':
        if (state.items.includes(action.item)) return
        set({
          items: [...state.items, action.item],
          nearby: null,
          message: ['Encontraste una tarjeta de acceso.', 'Quizá abra alguna puerta de la planta.'],
        })
        return
      case 'door':
        goThroughDoor(action.doorId)
        return
    }
  },
}))

function goThroughDoor(doorId: string): void {
  const { getState, setState } = useGameStore
  const state = getState()
  const door = DOORS.find((d) => d.id === doorId)
  if (!door) return
  const destination = otherSide(door, state.room)
  const destinationName = ROOMS[destination].name

  if (door.lock === 'soon' || !ROOMS[destination].built) {
    setState({ message: [`${destinationName}.`, 'Acceso restringido. Esta sección sigue en construcción.'] })
    return
  }

  if (door.lock === 'keycard' && !state.unlockedDoors.includes(door.id)) {
    if (!state.items.includes('keycard')) {
      setState({ message: ['La puerta está cerrada.', 'Parece necesitar una tarjeta de acceso.'] })
      return
    }
    setState({
      unlockedDoors: [...state.unlockedDoors, door.id],
      message: ['Usaste la tarjeta de acceso.', 'La puerta se desbloqueó.'],
    })
    return
  }

  setState({ transitioning: true, nearby: null })
  window.setTimeout(() => {
    const spawn = spawnThrough(door, destination)
    const current = getState()
    setState({
      room: destination,
      visited: current.visited.includes(destination) ? current.visited : [...current.visited, destination],
      spawn: { room: destination, ...spawn, version: current.spawn.version + 1 },
    })
    window.setTimeout(() => setState({ transitioning: false }), FADE_MS)
  }, FADE_MS)
}
