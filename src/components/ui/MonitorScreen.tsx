import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'

const LOG_LINES: { label?: string; value: string }[] = [
  { value: 'DEVELOPER LOG #001' },
  { value: '' },
  { label: 'Nombre', value: 'Roberto Bolaños' },
  { label: 'Rol', value: 'Mobile Tech Lead' },
  { label: 'Especialidad', value: 'Flutter y desarrollo móvil' },
  { value: '' },
  { label: 'Estado del sistema', value: 'operativo' },
]

/** Interfaz HTML del monitor CRT. La escena sigue visible detrás. */
export function MonitorScreen() {
  const setInteraction = useGameStore((state) => state.setInteraction)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButton.current?.focus()
  }, [])

  return (
    <div className="crt-backdrop">
      <section className="crt" role="dialog" aria-modal="true" aria-labelledby="crt-title">
        <div className="crt__screen">
          {LOG_LINES.map((line, index) =>
            index === 0 ? (
              <h2 key={index} id="crt-title" className="crt__line crt__title" style={{ animationDelay: '0ms' }}>
                {line.value}
              </h2>
            ) : (
              <p key={index} className="crt__line" style={{ animationDelay: `${index * 140}ms` }}>
                {line.label ? (
                  <>
                    <span className="crt__label">{line.label}:</span> {line.value}
                  </>
                ) : (
                  line.value || ' '
                )}
              </p>
            ),
          )}
          <p className="crt__line crt__cursor" style={{ animationDelay: `${LOG_LINES.length * 140}ms` }}>
            &gt; <span aria-hidden="true">_</span>
          </p>
        </div>
        <button ref={closeButton} type="button" className="crt__close" onClick={() => setInteraction(null)}>
          [ESC] Cerrar
        </button>
      </section>
    </div>
  )
}
