import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'

/** Cuadro de diálogo de la puerta cerrada. */
export function DoorMessage() {
  const setInteraction = useGameStore((state) => state.setInteraction)
  const box = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    box.current?.focus()
  }, [])

  return (
    <button ref={box} type="button" className="dialog-box" onClick={() => setInteraction(null)}>
      <span className="dialog-box__text">La puerta está cerrada.</span>
      <span className="dialog-box__text">Parece necesitar una tarjeta de acceso.</span>
      <span className="dialog-box__hint">
        <kbd>E</kbd> continuar
      </span>
    </button>
  )
}
