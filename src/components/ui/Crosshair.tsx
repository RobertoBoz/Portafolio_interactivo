import { useGameStore } from '../../store/gameStore'

/** Retícula de primera persona; se abre cuando hay algo con qué interactuar. */
export function Crosshair() {
  const active = useGameStore((state) => state.nearby !== null)
  return <div className={`crosshair${active ? ' crosshair--active' : ''}`} aria-hidden="true" />
}
