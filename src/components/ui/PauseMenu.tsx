import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import { requestPointerLock } from '../../world/pointerLock'

/** Menú de pausa: aparece al soltar el ratón (Esc) o con Esc en la cámara clásica. */
export function PauseMenu() {
  const firstPerson = useGameStore((state) => state.settings.cameraMode === 'firstPerson')
  const setPaused = useGameStore((state) => state.setPaused)
  const toggleMap = useGameStore((state) => state.toggleMap)
  const openIndex = useGameStore((state) => state.openIndex)
  const openSettings = useGameStore((state) => state.openSettings)
  const returnToLobby = useGameStore((state) => state.returnToLobby)
  const resume = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    resume.current?.focus()
  }, [])

  const onResume = () => {
    setPaused(false)
    if (firstPerson) requestPointerLock()
  }

  return (
    <div className="pause">
      <nav className="pause__menu" aria-label="Pausa">
        <h2 className="pause__title">Pausa</h2>
        <button ref={resume} type="button" className="pause__item" onClick={onResume}>
          Continuar
        </button>
        <button type="button" className="pause__item" onClick={toggleMap}>
          Plano <kbd>M</kbd>
        </button>
        <button type="button" className="pause__item" onClick={openIndex}>
          Índice del portafolio <kbd>I</kbd>
        </button>
        <button
          type="button"
          className="pause__item"
          onClick={() => {
            returnToLobby()
            if (firstPerson) requestPointerLock()
          }}
        >
          Volver al lobby
        </button>
        <button type="button" className="pause__item" onClick={openSettings}>
          Ajustes
        </button>
        {firstPerson && <p className="pause__hint">Haz clic en Continuar para volver a capturar el ratón.</p>}
      </nav>
    </div>
  )
}
