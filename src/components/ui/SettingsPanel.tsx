import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import type { CameraMode, Resolution } from '../../store/settings'

const CAMERA_OPTIONS: { value: CameraMode; label: string; hint: string }[] = [
  { value: 'firstPerson', label: 'Primera persona', hint: 'Ratón para mirar, WASD para moverte.' },
  { value: 'classic', label: 'Cámara clásica', hint: 'Cámaras fijas y control tipo tanque, como los survival horror de PS1.' },
]

const RESOLUTION_OPTIONS: { value: Resolution; label: string }[] = [
  { value: 'low', label: 'Baja (240 líneas)' },
  { value: 'medium', label: 'Media (360 líneas)' },
  { value: 'high', label: 'Alta (540 líneas)' },
]

/** Ajustes de cámara y calidad gráfica. Se guardan en el navegador. */
export function SettingsPanel() {
  const settings = useGameStore((state) => state.settings)
  const update = useGameStore((state) => state.updateSettings)
  const close = useGameStore((state) => state.close)
  const firstField = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstField.current?.focus()
  }, [])

  return (
    <div className="sheet-backdrop">
      <section className="sheet sheet--narrow" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <header className="sheet__header">
          <h2 id="settings-title" className="sheet__title">
            Ajustes
          </h2>
          <button type="button" className="ui-button" onClick={close}>
            Listo
          </button>
        </header>

        <div className="sheet__scroll settings">
          <fieldset>
            <legend>Cámara</legend>
            {CAMERA_OPTIONS.map((option, i) => (
              <label key={option.value} className="settings__option">
                <input
                  ref={i === 0 ? firstField : undefined}
                  type="radio"
                  name="camera"
                  checked={settings.cameraMode === option.value}
                  onChange={() => update({ cameraMode: option.value })}
                />
                <span>
                  {option.label}
                  <small>{option.hint}</small>
                </span>
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Resolución interna</legend>
            {RESOLUTION_OPTIONS.map((option) => (
              <label key={option.value} className="settings__option">
                <input
                  type="radio"
                  name="resolution"
                  checked={settings.resolution === option.value}
                  onChange={() => update({ resolution: option.value })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Efectos</legend>
            <label className="settings__option">
              <input type="checkbox" checked={settings.vertexSnap} onChange={(e) => update({ vertexSnap: e.target.checked })} />
              <span>
                Temblor de vértices
                <small>Polígonos que "tiemblan" como en PS1.</small>
              </span>
            </label>
            <label className="settings__option">
              <input
                type="checkbox"
                checked={settings.screenEffects}
                onChange={(e) => update({ screenEffects: e.target.checked })}
              />
              <span>
                Scanlines y viñeta
                <small>Líneas de televisor sobre la imagen 3D.</small>
              </span>
            </label>
          </fieldset>

          <fieldset>
            <legend>Ratón</legend>
            <label className="settings__range">
              <span>Sensibilidad: {settings.mouseSensitivity.toFixed(1)}</span>
              <input
                type="range"
                min={0.3}
                max={2.5}
                step={0.1}
                value={settings.mouseSensitivity}
                onChange={(e) => update({ mouseSensitivity: Number(e.target.value) })}
              />
            </label>
          </fieldset>
        </div>
      </section>
    </div>
  )
}
