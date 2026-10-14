import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'

/** Cuadro de diálogo inferior para mensajes cortos (puertas, objetos). */
export function MessageBox({ lines }: { lines: string[] }) {
  const close = useGameStore((state) => state.close)
  const box = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    box.current?.focus()
  }, [])

  return (
    <button ref={box} type="button" className="dialog-box" onClick={close}>
      {lines.map((line) => (
        <span key={line} className="dialog-box__text">
          {line}
        </span>
      ))}
      <span className="dialog-box__hint">
        <kbd>E</kbd> continuar
      </span>
    </button>
  )
}
