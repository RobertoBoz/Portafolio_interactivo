import { IndexContent } from './IndexContent'

/** Vista sin 3D cuando el navegador no soporta WebGL: el portafolio completo en texto. */
export function NoWebGL() {
  return (
    <main className="no-webgl">
      <header className="sheet__header">
        <div>
          <h1 className="sheet__title">Roberto Bolaños · Portafolio</h1>
          <p className="sheet__subtitle">
            Tu navegador no tiene WebGL activado, así que no se puede mostrar la oficina en 3D. Aquí está todo el contenido.
          </p>
        </div>
      </header>
      <IndexContent />
    </main>
  )
}

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}
