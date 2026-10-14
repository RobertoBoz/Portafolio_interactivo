import { create } from 'zustand'

export type Interaction = 'monitor' | 'door'

type GameState = {
  /** true mientras hay una interfaz de interacción abierta (el personaje no se mueve). */
  isInteracting: boolean
  activeInteraction: Interaction | null
  /** Objeto al alcance del personaje, si lo hay. Lo actualiza el personaje. */
  nearbyInteraction: Interaction | null
  setInteraction: (interaction: Interaction | null) => void
  setNearbyInteraction: (interaction: Interaction | null) => void
}

export const useGameStore = create<GameState>()((set) => ({
  isInteracting: false,
  activeInteraction: null,
  nearbyInteraction: null,
  setInteraction: (interaction) =>
    set({ activeInteraction: interaction, isInteracting: interaction !== null }),
  setNearbyInteraction: (interaction) => set({ nearbyInteraction: interaction }),
}))
