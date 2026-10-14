import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { DOOR } from '../world/layout'
import { createNoiseTexture, createTextTexture } from '../world/textures'
import { ps1VertexSnap } from '../world/ps1Material'

const FRAME = 0.08

/** Puerta metálica cerrada con lector de tarjeta. Siempre permanece cerrada en esta versión. */
export function Door() {
  const led = useRef<THREE.MeshBasicMaterial>(null)

  const textures = useMemo(
    () => ({
      panel: createNoiseTexture({ base: '#3f454b', grain: 18, stains: 5, seed: 71 }),
      sign: createTextTexture(['ACCESO', 'RESTRINGIDO'], {
        width: 64,
        height: 24,
        color: '#e8d48a',
        background: '#5a1a14',
        fontSize: 8,
      }),
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (led.current) led.current.color.set(Math.sin(clock.elapsedTime * 3) > 0 ? '#ff2a1a' : '#4a0a06')
  })

  const { width, height } = DOOR

  return (
    <group position={[DOOR.position[0], 0, DOOR.position[2] + 0.03]}>
      {/* Marco */}
      <mesh position={[-(width / 2 + FRAME / 2), height / 2, 0]}>
        <boxGeometry args={[FRAME, height + FRAME, 0.1]} />
        <meshLambertMaterial color="#222426" />
      </mesh>
      <mesh position={[width / 2 + FRAME / 2, height / 2, 0]}>
        <boxGeometry args={[FRAME, height + FRAME, 0.1]} />
        <meshLambertMaterial color="#222426" />
      </mesh>
      <mesh position={[0, height + FRAME / 2, 0]}>
        <boxGeometry args={[width + FRAME * 2, FRAME, 0.1]} />
        <meshLambertMaterial color="#222426" />
      </mesh>

      {/* Hoja de la puerta */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, 0.05]} />
        <meshLambertMaterial map={textures.panel} onBeforeCompile={ps1VertexSnap} />
      </mesh>
      {/* Ventanilla oscura */}
      <mesh position={[0, height * 0.72, 0.03]}>
        <planeGeometry args={[0.3, 0.42]} />
        <meshBasicMaterial color="#07090a" />
      </mesh>
      {/* Manija */}
      <mesh position={[width / 2 - 0.14, 1.0, 0.06]}>
        <boxGeometry args={[0.16, 0.04, 0.05]} />
        <meshLambertMaterial color="#9a9c98" />
      </mesh>

      {/* Letrero */}
      <mesh position={[0, height + 0.3, 0.01]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshLambertMaterial map={textures.sign} />
      </mesh>

      {/* Lector de tarjeta */}
      <group position={[width / 2 + 0.32, 1.25, 0.04]}>
        <mesh>
          <boxGeometry args={[0.14, 0.22, 0.05]} />
          <meshLambertMaterial color="#1b1d1f" />
        </mesh>
        <mesh position={[0, -0.04, 0.026]}>
          <planeGeometry args={[0.09, 0.02]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0.07, 0.027]}>
          <planeGeometry args={[0.03, 0.03]} />
          <meshBasicMaterial ref={led} color="#ff2a1a" fog={false} />
        </mesh>
        <pointLight color="#ff2a1a" intensity={0.25} distance={1.2} decay={2} position={[0, 0.07, 0.12]} />
      </group>
    </group>
  )
}
