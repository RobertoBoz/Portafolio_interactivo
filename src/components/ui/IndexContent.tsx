import { panelContent, type PanelId } from '../../content/portfolio'
import { ROOM_LIST } from '../../world/building'
import { INTERACTABLES } from '../../world/interactions'
import { PanelBody } from './PanelBody'

/** Secciones del portafolio agrupadas por cuarto, en el orden del plano. */
const SECTIONS = ROOM_LIST.map((room) => ({
  room,
  panels: INTERACTABLES.flatMap((item) => (item.room === room.id && item.action.type === 'panel' ? [item.action.panel as PanelId] : [])),
})).filter((section) => section.panels.length > 0)

/**
 * Todo el contenido del portafolio como texto navegable, sin recorrer el nivel.
 * Lo usan el índice (tecla I) y la vista sin WebGL.
 */
export function IndexContent() {
  return (
    <div className="index__sections">
      {SECTIONS.map(({ room, panels }) => (
        <section key={room.id} className="index__room" aria-labelledby={`index-${room.id}`}>
          <h3 id={`index-${room.id}`} className="index__room-title">
            <span className="index__number">{room.number}</span>
            {room.name}
          </h3>
          {panels.map((id) => {
            const content = panelContent(id)
            return (
              <details key={id} className="index__item">
                <summary>
                  {content.title}
                  {content.subtitle && <span className="index__subtitle"> · {content.subtitle}</span>}
                </summary>
                <div className="index__body">
                  <PanelBody content={content} />
                </div>
              </details>
            )
          })}
        </section>
      ))}
    </div>
  )
}
