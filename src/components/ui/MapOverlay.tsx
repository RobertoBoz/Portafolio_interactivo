import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import { DOORS, DOOR_SIZE, ROOM_LIST, rectCenter } from '../../world/building'
import { player } from '../../world/player'

const VIEW = { minX: -16, minZ: -14, width: 32, height: 28 }

/** Plano de la planta baja: cuarto actual, cuartos visitados y puertas cerradas. */
export function MapOverlay() {
  const current = useGameStore((state) => state.room)
  const visited = useGameStore((state) => state.visited)
  const unlockedDoors = useGameStore((state) => state.unlockedDoors)
  const close = useGameStore((state) => state.close)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButton.current?.focus()
  }, [])

  const arrowAngle = (Math.atan2(Math.cos(player.heading), Math.sin(player.heading)) * 180) / Math.PI

  return (
    <div className="map-backdrop">
      <section className="map" role="dialog" aria-modal="true" aria-labelledby="map-title">
        <header className="map__header">
          <span className="map__bar" aria-hidden="true" />
          <div>
            <h2 id="map-title" className="map__title">
              Planta baja
            </h2>
            <p className="map__subtitle">Oficina de desarrollo</p>
          </div>
        </header>

        <div className="map__body">
          <svg
            className="map__plan"
            viewBox={`${VIEW.minX} ${VIEW.minZ} ${VIEW.width} ${VIEW.height}`}
            role="img"
            aria-label="Plano de la planta baja"
          >
            {ROOM_LIST.map((room) => {
              const { minX, maxX, minZ, maxZ } = room.rect
              const state = room.id === current ? 'current' : visited.includes(room.id) ? 'visited' : room.built ? 'open' : 'locked'
              const center = rectCenter(room.rect)
              return (
                <g key={room.id} className={`map__room map__room--${state}`}>
                  <rect x={minX} y={minZ} width={maxX - minX} height={maxZ - minZ} />
                  <circle cx={center.x} cy={center.z - 0.55} r={0.75} className="map__badge" />
                  <text x={center.x} y={center.z - 0.55} className="map__number">
                    {room.number}
                  </text>
                  <text x={center.x} y={center.z + 0.9} className="map__label">
                    {room.mapLabel ?? room.name}
                  </text>
                </g>
              )
            })}

            {DOORS.map((door) => {
              const locked = door.lock === 'soon' || (door.lock === 'keycard' && !unlockedDoors.includes(door.id))
              const half = DOOR_SIZE.width / 2
              return door.axis === 'x' ? (
                <line
                  key={door.id}
                  className={`map__door${locked ? ' map__door--locked' : ''}`}
                  x1={door.x}
                  x2={door.x}
                  y1={door.z - half}
                  y2={door.z + half}
                />
              ) : (
                <line
                  key={door.id}
                  className={`map__door${locked ? ' map__door--locked' : ''}`}
                  x1={door.x - half}
                  x2={door.x + half}
                  y1={door.z}
                  y2={door.z}
                />
              )
            })}

            {/* Entrada */}
            <line className="map__door" x1={-1.5} x2={1.5} y1={12} y2={12} />
            <text x={0} y={13.4} className="map__label map__entrance">
              ENTRADA
            </text>

            <g transform={`translate(${player.x} ${player.z}) rotate(${arrowAngle})`} className="map__player">
              <polygon points="0.75,0 -0.45,0.45 -0.2,0 -0.45,-0.45" />
            </g>
          </svg>

          <aside className="map__legend">
            <ol>
              {ROOM_LIST.map((room) => (
                <li
                  key={room.id}
                  className={room.id === current ? 'is-current' : room.built ? undefined : 'is-locked'}
                >
                  <span className="map__legend-number">{room.number}</span>
                  {room.name}
                  {!room.built && <span className="map__legend-tag">próximamente</span>}
                </li>
              ))}
            </ol>
            <button ref={closeButton} type="button" className="crt__close map__close" onClick={close}>
              [M] Cerrar
            </button>
          </aside>
        </div>
      </section>
    </div>
  )
}
