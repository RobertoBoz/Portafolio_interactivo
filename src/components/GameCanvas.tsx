import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Office } from '../scenes/Office'
import { KEY_MAP } from '../world/controls'

/**
 * Altura interna de render en píxeles. El canvas se dibuja a esta resolución
 * y el navegador lo escala con `image-rendering: pixelated`.
 */
const TARGET_LINES = 360

function lowResolutionDpr(): number {
  const height = typeof window === 'undefined' ? TARGET_LINES : window.innerHeight
  return Math.min(1, Math.max(0.25, TARGET_LINES / height))
}

export function GameCanvas() {
  return (
    <KeyboardControls map={KEY_MAP}>
      <Canvas
        className="game-canvas"
        dpr={lowResolutionDpr()}
        flat
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <Office />
      </Canvas>
    </KeyboardControls>
  )
}
