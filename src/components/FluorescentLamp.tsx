import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { LAMP } from '../world/layout'

const BASE_INTENSITY = 7

/**
 * Lámpara fluorescente de techo. Casi siempre encendida, con parpadeos
 * cortos e irregulares para dar tensión.
 */
export function FluorescentLamp() {
  const light = useRef<THREE.PointLight>(null)
  const tube = useRef<THREE.MeshBasicMaterial>(null)
  const nextFlicker = useRef(2)
  const flickerUntil = useRef(0)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (t > nextFlicker.current) {
      flickerUntil.current = t + 0.08 + Math.random() * 0.25
      nextFlicker.current = t + 2.5 + Math.random() * 6
    }
    const flickering = t < flickerUntil.current
    const on = !flickering || Math.sin(t * 90) > 0.2
    const level = on ? 1 : 0.12

    if (light.current) light.current.intensity = BASE_INTENSITY * level
    if (tube.current) tube.current.color.setScalar(on ? 0.95 : 0.25)
  })

  return (
    <group position={LAMP.position}>
      <mesh>
        <boxGeometry args={[1.5, 0.08, 0.3]} />
        <meshLambertMaterial color="#3d3f3c" />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1.35, 0.04, 0.08]} />
        <meshBasicMaterial ref={tube} color="#f2fff0" fog={false} />
      </mesh>
      <pointLight
        ref={light}
        position={[0, -0.25, 0]}
        color="#d4ecd6"
        intensity={BASE_INTENSITY}
        distance={11}
        decay={1.4}
      />
    </group>
  )
}
