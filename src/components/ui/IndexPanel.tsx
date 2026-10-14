import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import { IndexContent } from './IndexContent'

/** Índice accesible del portafolio: consulta todas las secciones sin recorrer la oficina. */
export function IndexPanel() {
  const close = useGameStore((state) => state.close)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButton.current?.focus()
  }, [])

  return (
    <div className="sheet-backdrop">
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="index-title">
        <header className="sheet__header">
          <div>
            <h2 id="index-title" className="sheet__title">
              Índice del portafolio
            </h2>
            <p className="sheet__subtitle">Todo el contenido, sin recorrer la oficina</p>
          </div>
          <button ref={closeButton} type="button" className="ui-button" onClick={close}>
            Cerrar <kbd>I</kbd>
          </button>
        </header>
        <div className="sheet__scroll">
          <IndexContent />
        </div>
      </section>
    </div>
  )
}
