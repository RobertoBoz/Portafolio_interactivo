import { create } from 'zustand'
import type { PanelId } from '../content/portfolio'
import { DOORS, ROOMS, START, doorsOf, otherSide, spawnThrough, type RoomId } from '../world/building'
import { interactableById, type Item } from '../world/interactions'
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type Settings } from './settings'

const DOOR_OPEN_MS = 520
const FADE_MS = 380

type Spawn = { room: RoomId; x: number; z: number; heading: number; version: number }
export type DoorAnimation = { doorId: string; kind: 'open' | 'rattle'; startedAt: number }

type GameState = {
  /** false mientras se muestra la pantalla inicial. */
  started: boolean
  /** El ratón está capturado (primera persona). */
  pointerLocked: boolean
  /** Pausa de la cámara clásica (en primera persona la pausa es soltar el ratón). */
  paused: boolean
  settings: Settings

  room: RoomId
  visited: RoomId[]
  items: Item[]
  unlockedDoors: string[]
  /** Id del objeto interactuable al alcance. Lo actualiza el controlador del jugador. */
  nearby: string | null

  panel: PanelId | null
  message: string[] | null
  mapOpen: boolean
  indexOpen: boolean
  settingsOpen: boolean
  /** true durante el fundido a negro al cruzar una puerta. */
  transitioning: boolean
  doorAnimation: DoorAnimation | null
  /** Cambia cuando el jugador debe aparecer en otro lugar. */
  spawn: Spawn

  start: () => void
  setPointerLocked: (locked: boolean) => void
  setPaused: (paused: boolean) => void
  updateSettings: (patch: Partial<Settings>) => void
  setNearby: (id: string | null) => void
  interact: () => void
  close: () => void
  toggleMap: () => void
  openIndex: () => void
  openSettings: () => void
  openPanel: (panel: PanelId) => void
  returnToLobby: () => void
}

/** Hay alguna ventana encima del juego. */
export function hasOverlay(state: GameState): boolean {
  return state.panel !== null || state.message !== null || state.mapOpen || state.indexOpen || state.settingsOpen
}

/** Se muestra el menú de pausa. */
export function isPaused(state: GameState): boolean {
  if (!state.started || hasOverlay(state) || state.transitioning) return false
  return state.settings.cameraMode === 'firstPerson' ? !state.pointerLocked : state.paused
}

/** El jugador no puede moverse. */
export function isBusy(state: GameState): boolean {
  if (!state.started || hasOverlay(state) || state.transitioning || state.doorAnimation?.kind === 'open') return true
  return isPaused(state)
}

function initialSpawn(): Spawn {
  // ?sala=desarrollo empieza en un cuarto construido (enlaces directos y pruebas).
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
  started: false,
  pointerLocked: false,
  paused: false,
  settings: typeof window === 'undefined' ? DEFAULT_SETTINGS : loadSettings(),

  room: firstSpawn.room,
  visited: [firstSpawn.room],
  items: [],
  unlockedDoors: [],
  nearby: null,
  panel: null,
  message: null,
  mapOpen: false,
  indexOpen: false,
  settingsOpen: false,
  transitioning: false,
  doorAnimation: null,
  spawn: firstSpawn,

  start: () => set({ started: true, paused: false, indexOpen: false, settingsOpen: false }),
  setPointerLocked: (locked) => set({ pointerLocked: locked }),
  setPaused: (paused) => set({ paused }),

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch }
    saveSettings(settings)
    set({ settings })
  },

  setNearby: (id) => set({ nearby: id }),

  close: () => set({ panel: null, message: null, mapOpen: false, indexOpen: false, settingsOpen: false }),

  toggleMap: () => {
    const state = get()
    if (!state.started || state.transitioning || state.panel || state.message || state.indexOpen || state.settingsOpen) return
    set({ mapOpen: !state.mapOpen })
  },

  openIndex: () => set({ indexOpen: true, mapOpen: false, settingsOpen: false, panel: null, message: null }),
  openSettings: () => set({ settingsOpen: true, mapOpen: false, indexOpen: false }),
  openPanel: (panel) => set({ panel, indexOpen: false }),

  returnToLobby: () => {
    if (get().transitioning) return
    set({
      transitioning: true,
      paused: false,
      nearby: null,
      panel: null,
      message: null,
      mapOpen: false,
      indexOpen: false,
      settingsOpen: false,
    })
    window.setTimeout(() => {
      const current = get()
      set({
        room: START.room,
        spawn: { room: START.room, x: START.x, z: START.z, heading: START.heading, version: current.spawn.version + 1 },
      })
      window.setTimeout(() => set({ transitioning: false }), FADE_MS)
    }, FADE_MS)
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
      case 'map':
        set({ mapOpen: true })
        return
      case 'door':
        goThroughDoor(action.doorId)
        return
    }
  },
}))

function rattle(doorId: string, lines: string[]): void {
  useGameStore.setState({ doorAnimation: { doorId, kind: 'rattle', startedAt: performance.now() }, message: lines })
  window.setTimeout(() => {
    if (useGameStore.getState().doorAnimation?.doorId === doorId) useGameStore.setState({ doorAnimation: null })
  }, 600)
}

/** La puerta gira sobre su bisagra, la pantalla funde a negro y el jugador aparece del otro lado. */
function goThroughDoor(doorId: string): void {
  const { getState, setState } = useGameStore
  const state = getState()
  const door = DOORS.find((d) => d.id === doorId)
  if (!door) return
  const destination = otherSide(door, state.room)

  if (door.lock === 'soon' || !ROOMS[destination].built) {
    rattle(door.id, door.lockedMessage ?? [`${ROOMS[destination].name}.`, 'Está cerrada. Esta sección sigue en construcción.'])
    return
  }

  if (door.lock === 'keycard' && !state.unlockedDoors.includes(door.id)) {
    if (!state.items.includes('keycard')) {
      rattle(door.id, ['La puerta está cerrada.', 'Parece necesitar una tarjeta de acceso.'])
      return
    }
    setState({
      unlockedDoors: [...state.unlockedDoors, door.id],
      message: ['Usaste la tarjeta de acceso.', 'La puerta se desbloqueó.'],
    })
    return
  }

  setState({ nearby: null, doorAnimation: { doorId, kind: 'open', startedAt: performance.now() } })
  window.setTimeout(() => {
    setState({ transitioning: true })
    window.setTimeout(() => {
      const spawn = spawnThrough(door, destination)
      const current = getState()
      setState({
        room: destination,
        doorAnimation: null,
        visited: current.visited.includes(destination) ? current.visited : [...current.visited, destination],
        spawn: { room: destination, ...spawn, version: current.spawn.version + 1 },
      })
      window.setTimeout(() => setState({ transitioning: false }), FADE_MS)
    }, FADE_MS)
  }, DOOR_OPEN_MS)
}
