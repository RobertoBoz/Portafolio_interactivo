import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Office } from '../scenes/Office'
import { KEY_MAP } from '../world/controls'
import { PS1_SNAP } from '../world/ps1Material'
import { requestPointerLock } from '../world/pointerLock'
import { hasOverlay, useGameStore } from '../store/gameStore'
import { RESOLUTION_LINES } from '../store/settings'

/**
 * Canvas 3D a baja resolución: se dibuja a pocas líneas verticales y el
 * navegador lo escala con `image-rendering: pixelated`. La interfaz HTML va
 * aparte, así que sus textos se mantienen nítidos.
 */
export function GameCanvas() {
  const resolution = useGameStore((state) => state.settings.resolution)
  const vertexSnap = useGameStore((state) => state.settings.vertexSnap)
  const lines = RESOLUTION_LINES[resolution]
  const dpr = Math.min(1, Math.max(0.2, lines / window.innerHeight))

  useEffect(() => {
    PS1_SNAP.value = vertexSnap ? 1 : 0
  }, [vertexSnap])

  const onPointerDown = () => {
    const state = useGameStore.getState()
    if (state.started && state.settings.cameraMode === 'firstPerson' && !hasOverlay(state)) requestPointerLock()
  }

  return (
    <KeyboardControls map={KEY_MAP}>
      <Canvas
        className="game-canvas"
        dpr={dpr}
        flat
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        onPointerDown={onPointerDown}
      >
        <Office />
      </Canvas>
    </KeyboardControls>
  )
}
