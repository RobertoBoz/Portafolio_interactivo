import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { CHARACTER } from '../world/building'
import { player } from '../world/player'
import { CharacterModel } from './CharacterModel'

/**
 * Personaje visible en la cámara clásica. Sigue la posición del jugador y anima
 * piernas y brazos según la velocidad, con pocos fotogramas como en PS1.
 */
export function CharacterAvatar() {
  const root = useRef<THREE.Group>(null)
  const leftLeg = useRef<THREE.Group>(null)
  const rightLeg = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)
  const walkPhase = useRef(0)

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    if (root.current) {
      root.current.position.set(player.x, 0, player.z)
      root.current.rotation.y = player.heading
    }
    const amount = Math.min(Math.abs(player.speed) / CHARACTER.walkSpeed, 1)
    walkPhase.current += delta * 7 * amount * Math.sign(player.speed || 1)
    const swing = Math.round(Math.sin(walkPhase.current) * 4) / 4
    const angle = swing * 0.55 * amount
    if (leftLeg.current) leftLeg.current.rotation.x = angle
    if (rightLeg.current) rightLeg.current.rotation.x = -angle
    if (leftArm.current) leftArm.current.rotation.x = -angle * 0.8
    if (rightArm.current) rightArm.current.rotation.x = angle * 0.8
  })

  return (
    <group ref={root}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.36, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <CharacterModel limbs={{ leftLeg, rightLeg, leftArm, rightArm }} />
    </group>
  )
}
