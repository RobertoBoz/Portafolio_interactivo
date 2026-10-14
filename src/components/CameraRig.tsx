import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import type * as THREE from 'three'
import { cameraFor, type CameraShot } from '../world/building'
import { player } from '../world/player'

/**
 * Cámaras fijas por cuarto. Cuando el personaje entra en otra zona, la cámara
 * corta de golpe a otro ángulo, como en los survival horror clásicos. Nunca lo sigue.
 */
export function CameraRig() {
  const camera = useRef<THREE.PerspectiveCamera>(null)
  const current = useRef<CameraShot | null>(null)

  useFrame(() => {
    const shot = cameraFor(player.room, player.x, player.z)
    const cam = camera.current
    if (!shot || !cam || shot === current.current) return
    current.current = shot
    cam.position.set(...shot.position)
    cam.fov = shot.fov
    cam.updateProjectionMatrix()
    cam.lookAt(...shot.target)
  })

  return <PerspectiveCamera ref={camera} makeDefault near={0.1} far={40} />
}
