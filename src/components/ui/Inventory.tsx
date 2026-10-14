import { useGameStore } from '../../store/gameStore'

/** Objetos que lleva el personaje. Por ahora solo la tarjeta de acceso. */
export function Inventory() {
  const hasKeycard = useGameStore((state) => state.items.includes('keycard'))
  if (!hasKeycard) return null
  return (
    <div className="inventory" aria-label="Inventario">
      <div className="inventory__slot" title="Tarjeta de acceso">
        <span className="inventory__card" aria-hidden="true" />
        <span className="inventory__label">Tarjeta</span>
      </div>
    </div>
  )
}
