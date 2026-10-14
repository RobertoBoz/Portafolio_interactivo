import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { player } from '../world/player'

const EYE_HEIGHT = 1.6
const BOB = { amplitude: 0.035, frequency: 9 }

/** Cámara en los ojos del jugador, con un leve balanceo al caminar. */
export function FirstPersonCamera() {
  const camera = useRef<THREE.PerspectiveCamera>(null)
  const target = useRef(new THREE.Vector3())
  const phase = useRef(0)

  useFrame((_, rawDelta) => {
    const cam = camera.current
    if (!cam) return
    const delta = Math.min(rawDelta, 0.05)
    const moving = Math.min(Math.abs(player.speed) / 2.2, 1)
    phase.current += delta * BOB.frequency * moving
    const y = EYE_HEIGHT + Math.sin(phase.current) * BOB.amplitude * moving

    cam.position.set(player.x, y, player.z)
    const cosPitch = Math.cos(player.pitch)
    target.current.set(
      player.x + Math.sin(player.heading) * cosPitch,
      y + Math.sin(player.pitch),
      player.z + Math.cos(player.heading) * cosPitch,
    )
    cam.lookAt(target.current)
  })

  return <PerspectiveCamera ref={camera} makeDefault fov={70} near={0.05} far={40} />
}
