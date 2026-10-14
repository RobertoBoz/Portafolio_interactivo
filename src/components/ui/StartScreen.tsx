import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import { requestPointerLock } from '../../world/pointerLock'

/** Pantalla inicial con el botón para entrar, los controles y acceso al índice. */
export function StartScreen() {
  const start = useGameStore((state) => state.start)
  const openIndex = useGameStore((state) => state.openIndex)
  const openSettings = useGameStore((state) => state.openSettings)
  const firstPerson = useGameStore((state) => state.settings.cameraMode === 'firstPerson')
  const enter = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    enter.current?.focus()
  }, [])

  const onEnter = () => {
    start()
    if (firstPerson) requestPointerLock()
  }

  return (
    <div className="start">
      <div className="start__panel">
        <p className="start__kicker">Planta baja · Oficina de desarrollo</p>
        <h1 className="start__title">Roberto Bolaños</h1>
        <p className="start__subtitle">Tech Lead Mobile · Portafolio interactivo</p>

        <button ref={enter} type="button" className="start__enter" onClick={onEnter}>
          Entrar a la oficina
        </button>

        <dl className="start__controls">
          {firstPerson ? (
            <>
              <dt>Ratón</dt>
              <dd>Mirar alrededor</dd>
              <dt>W A S D</dt>
              <dd>Moverte</dd>
            </>
          ) : (
            <>
              <dt>W / S</dt>
              <dd>Avanzar y retroceder</dd>
              <dt>A / D</dt>
              <dd>Girar</dd>
            </>
          )}
          <dt>E</dt>
          <dd>Interactuar y abrir puertas</dd>
          <dt>M</dt>
          <dd>Plano de la planta</dd>
          <dt>Esc</dt>
          <dd>Pausa y soltar el ratón</dd>
        </dl>

        <div className="start__secondary">
          <button type="button" className="ui-button" onClick={openIndex}>
            Ver portafolio sin recorrer
          </button>
          <button type="button" className="ui-button" onClick={openSettings}>
            Ajustes
          </button>
        </div>
      </div>
    </div>
  )
}
