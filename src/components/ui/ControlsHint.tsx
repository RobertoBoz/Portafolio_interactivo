/** Ayuda fija de controles en la esquina superior. */
export function ControlsHint() {
  return (
    <ul className="controls-hint" aria-label="Controles">
      <li>
        <kbd>W</kbd>
        <kbd>S</kbd> avanzar / retroceder
      </li>
      <li>
        <kbd>A</kbd>
        <kbd>D</kbd> girar
      </li>
      <li>
        <kbd>E</kbd> interactuar
      </li>
    </ul>
  )
}
