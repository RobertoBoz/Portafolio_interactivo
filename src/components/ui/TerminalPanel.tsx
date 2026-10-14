import { useEffect, useRef } from 'react'
import { panelContent, type PanelId } from '../../content/portfolio'
import { useGameStore } from '../../store/gameStore'
import { PanelBody } from './PanelBody'

/** Terminal CRT con el contenido del portafolio. La escena sigue visible detrás. */
export function TerminalPanel({ id }: { id: PanelId }) {
  const close = useGameStore((state) => state.close)
  const closeButton = useRef<HTMLButtonElement>(null)
  const content = panelContent(id)

  useEffect(() => {
    closeButton.current?.focus()
  }, [id])

  return (
    <div className="crt-backdrop">
      <section className="crt" role="dialog" aria-modal="true" aria-labelledby="crt-title">
        <div className="crt__screen">
          <h2 id="crt-title" className="crt__line crt__title">
            {content.title}
          </h2>
          {content.subtitle && <p className="crt__line crt__subtitle">{content.subtitle}</p>}
          <PanelBody content={content} animate />
          <p className="crt__line crt__cursor">
            &gt; <span aria-hidden="true">_</span>
          </p>
        </div>
        <button ref={closeButton} type="button" className="crt__close" onClick={close}>
          [E] Cerrar
        </button>
      </section>
    </div>
  )
}
