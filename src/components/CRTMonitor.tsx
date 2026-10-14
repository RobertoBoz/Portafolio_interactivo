import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { MONITOR } from '../world/layout'
import { createTextTexture } from '../world/textures'
import { ps1VertexSnap } from '../world/ps1Material'

const BODY: [number, number, number] = [0.52, 0.46, 0.5]
const SCREEN_GLOW = '#7dffa8'

/** Monitor CRT sobre la mesa. Su pantalla brilla y parpadea ligeramente. */
export function CRTMonitor() {
  const screen = useRef<THREE.MeshBasicMaterial>(null)
  const glow = useRef<THREE.PointLight>(null)

  const screenTexture = useMemo(
    () =>
      createTextTexture(['DEV LOG', '#001', '', '> _'], {
        width: 48,
        height: 36,
        color: '#8dffb0',
        background: '#062010',
        fontSize: 7,
      }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const pulse = 0.85 + Math.sin(t * 7) * 0.05 + (Math.random() - 0.5) * 0.06
    if (screen.current) screen.current.color.setScalar(pulse)
    if (glow.current) glow.current.intensity = 1.4 * pulse
  })

  return (
    <group position={MONITOR.position} rotation-y={MONITOR.rotationY}>
      {/* Carcasa */}
      <mesh position={[0, BODY[1] / 2 + 0.04, -0.05]}>
        <boxGeometry args={BODY} />
        <meshLambertMaterial color="#8c8672" onBeforeCompile={ps1VertexSnap} />
      </mesh>
      {/* Parte trasera más angosta del tubo */}
      <mesh position={[0, BODY[1] / 2 + 0.02, -0.38]}>
        <boxGeometry args={[0.36, 0.32, 0.22]} />
        <meshLambertMaterial color="#7a7563" onBeforeCompile={ps1VertexSnap} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.02, -0.05]}>
        <boxGeometry args={[0.32, 0.04, 0.3]} />
        <meshLambertMaterial color="#6d6858" />
      </mesh>
      {/* Pantalla */}
      <mesh position={[0, BODY[1] / 2 + 0.05, BODY[2] / 2 - 0.04]}>
        <planeGeometry args={[0.4, 0.3]} />
        <meshBasicMaterial ref={screen} map={screenTexture} fog={false} />
      </mesh>
      {/* Teclado */}
      <mesh position={[0, 0.015, 0.42]}>
        <boxGeometry args={[0.46, 0.03, 0.16]} />
        <meshLambertMaterial color="#77725f" />
      </mesh>
      <pointLight ref={glow} color={SCREEN_GLOW} intensity={1.4} distance={2.6} decay={1.8} position={[0, 0.3, 0.5]} />
    </group>
  )
}
