import type { Line, PanelContent } from '../../content/portfolio'

function renderLine(line: Line) {
  if (typeof line === 'string') return line
  return (
    <>
      <span className="crt__label">{line.label}:</span> {line.value}
    </>
  )
}

/**
 * Contenido de un panel: lo usan la terminal del juego y el índice accesible.
 * `animate` escalona la aparición de las líneas como en una terminal.
 */
export function PanelBody({ content, animate = false }: { content: PanelContent; animate?: boolean }) {
  let delay = 0
  const next = () => {
    if (!animate) return undefined
    delay += 80
    return { animationDelay: `${delay}ms` }
  }
  const lineClass = animate ? 'crt__line' : undefined

  return (
    <>
      {content.sections.map((section, s) => (
        <div key={s} className="crt__section">
          {section.heading && (
            <h3 className={`${lineClass ?? ''} crt__heading`} style={next()}>
              {section.heading}
            </h3>
          )}
          {section.paragraphs?.map((text) => (
            <p key={text} className={`${lineClass ?? ''} crt__paragraph`} style={next()}>
              {text}
            </p>
          ))}
          {section.lines?.map((line, i) => (
            <p key={i} className={lineClass} style={next()}>
              {renderLine(line)}
            </p>
          ))}
          {section.bullets && (
            <ul className="crt__list">
              {section.bullets.map((bullet) => (
                <li key={bullet} className={lineClass} style={next()}>
                  {bullet}
                </li>
              ))}
            </ul>
          )}
          {section.links && (
            <ul className="crt__links">
              {section.links.map((link) => (
                <li key={link.href} className={lineClass} style={next()}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    &gt; {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {section.download && (
            <p className={lineClass} style={next()}>
              <a className="crt__download" href={section.download.href} download>
                [ {section.download.label} ]
              </a>
            </p>
          )}
          {section.note && (
            <p className={`${lineClass ?? ''} crt__note`} style={next()}>
              {section.note}
            </p>
          )}
        </div>
      ))}
    </>
  )
}
