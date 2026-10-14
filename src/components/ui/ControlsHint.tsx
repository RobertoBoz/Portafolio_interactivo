import { useGameStore } from '../../store/gameStore'

/** Ayuda fija de controles en la esquina superior. */
export function ControlsHint() {
  const firstPerson = useGameStore((state) => state.settings.cameraMode === 'firstPerson')
  return (
    <ul className="controls-hint" aria-label="Controles">
      {firstPerson ? (
        <li>
          <kbd>W</kbd>
          <kbd>A</kbd>
          <kbd>S</kbd>
          <kbd>D</kbd> moverse · ratón mirar
        </li>
      ) : (
        <>
          <li>
            <kbd>W</kbd>
            <kbd>S</kbd> avanzar / retroceder
          </li>
          <li>
            <kbd>A</kbd>
            <kbd>D</kbd> girar
          </li>
        </>
      )}
      <li>
        <kbd>E</kbd> interactuar · <kbd>M</kbd> plano · <kbd>I</kbd> índice · <kbd>Esc</kbd> pausa
      </li>
    </ul>
  )
}
