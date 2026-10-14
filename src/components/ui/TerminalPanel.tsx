import { useEffect, useRef } from 'react'
import { panelContent, type Line, type PanelId } from '../../content/portfolio'
import { useGameStore } from '../../store/gameStore'

function renderLine(line: Line) {
  if (typeof line === 'string') return line
  return (
    <>
      <span className="crt__label">{line.label}:</span> {line.value}
    </>
  )
}

/** Terminal CRT con el contenido del portafolio. La escena sigue visible detrás. */
export function TerminalPanel({ id }: { id: PanelId }) {
  const close = useGameStore((state) => state.close)
  const closeButton = useRef<HTMLButtonElement>(null)
  const content = panelContent(id)
  let delay = 0
  const next = () => {
    delay += 90
    return { animationDelay: `${delay}ms` }
  }

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
          {content.subtitle && (
            <p className="crt__line crt__subtitle" style={next()}>
              {content.subtitle}
            </p>
          )}
          {content.sections.map((section, s) => (
            <div key={s} className="crt__section">
              {section.heading && (
                <h3 className="crt__line crt__heading" style={next()}>
                  {section.heading}
                </h3>
              )}
              {section.paragraphs?.map((text) => (
                <p key={text} className="crt__line crt__paragraph" style={next()}>
                  {text}
                </p>
              ))}
              {section.lines?.map((line, i) => (
                <p key={i} className="crt__line" style={next()}>
                  {renderLine(line)}
                </p>
              ))}
              {section.bullets && (
                <ul className="crt__list">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="crt__line" style={next()}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {section.links && (
                <ul className="crt__links">
                  {section.links.map((link) => (
                    <li key={link.href} className="crt__line" style={next()}>
                      <a href={link.href} target="_blank" rel="noreferrer">
                        &gt; {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {section.download && (
                <p className="crt__line" style={next()}>
                  <a className="crt__download" href={section.download.href} download>
                    [ {section.download.label} ]
                  </a>
                </p>
              )}
            </div>
          ))}
          <p className="crt__line crt__cursor" style={next()}>
            &gt; <span aria-hidden="true">_</span>
          </p>
        </div>
        <button ref={closeButton} type="button" className="crt__close" onClick={close}>
          [ESC] Cerrar
        </button>
      </section>
    </div>
  )
}
