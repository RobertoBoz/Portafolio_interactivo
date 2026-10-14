import { useLayoutEffect, useRef } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import type * as THREE from 'three'
import { CAMERA } from '../world/layout'

/** Cámara fija en una esquina del cuarto. Nunca sigue al personaje. */
export function FixedCamera() {
  const camera = useRef<THREE.PerspectiveCamera>(null)

  useLayoutEffect(() => {
    camera.current?.lookAt(...CAMERA.target)
  }, [])

  return (
    <PerspectiveCamera
      ref={camera}
      makeDefault
      position={CAMERA.position}
      fov={CAMERA.fov}
      near={0.1}
      far={30}
    />
  )
}
