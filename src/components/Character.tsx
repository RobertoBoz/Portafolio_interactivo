import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { CHARACTER } from '../world/layout'
import { resolveMove } from '../world/collision'
import { findNearbyInteraction } from '../world/interactions'
import type { Control } from '../world/controls'
import { useGameStore } from '../store/gameStore'
import { CharacterModel } from './CharacterModel'

/** Qué tan rápido alcanza la velocidad objetivo; bajo = movimiento pesado. */
const ACCELERATION = 5

/**
 * Personaje low-poly con controles tipo tanque:
 * W/S avanzan y retroceden en la dirección a la que mira, A/D lo giran.
 */
export function Character() {
  const root = useRef<THREE.Group>(null)
  const leftLeg = useRef<THREE.Group>(null)
  const rightLeg = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)

  const position = useRef({ x: CHARACTER.start[0], z: CHARACTER.start[2] })
  const heading = useRef<number>(CHARACTER.startHeading)
  const speed = useRef(0)
  const walkPhase = useRef(0)

  const [, getKeys] = useKeyboardControls<Control>()

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const { isInteracting, nearbyInteraction, setNearbyInteraction } = useGameStore.getState()
    const keys = getKeys()

    let turn = 0
    let move = 0
    if (!isInteracting) {
      turn = Number(keys.left) - Number(keys.right)
      move = Number(keys.forward) - Number(keys.backward)
    }

    heading.current += turn * CHARACTER.turnSpeed * delta
    const targetSpeed = move > 0 ? CHARACTER.walkSpeed : move < 0 ? -CHARACTER.backSpeed : 0
    speed.current = THREE.MathUtils.damp(speed.current, targetSpeed, ACCELERATION, delta)
    if (Math.abs(speed.current) < 0.01) speed.current = 0

    const step = speed.current * delta
    const next = resolveMove(
      position.current,
      {
        x: position.current.x + Math.sin(heading.current) * step,
        z: position.current.z + Math.cos(heading.current) * step,
      },
      CHARACTER.radius,
    )
    position.current = next

    if (root.current) {
      root.current.position.set(next.x, 0, next.z)
      root.current.rotation.y = heading.current
    }

    animateLimbs(delta)

    const nearby = findNearbyInteraction(position.current, heading.current)
    if (nearby !== nearbyInteraction) setNearbyInteraction(nearby)
  })

  /** Animación limitada: piernas y brazos oscilan según la velocidad, como en PS1. */
  function animateLimbs(delta: number) {
    const amount = Math.min(Math.abs(speed.current) / CHARACTER.walkSpeed, 1)
    walkPhase.current += delta * 7 * amount * Math.sign(speed.current || 1)
    // Cuantizar el ángulo da un movimiento "a saltos", con pocos fotogramas.
    const swing = Math.round(Math.sin(walkPhase.current) * 4) / 4
    const angle = swing * 0.55 * amount
    if (leftLeg.current) leftLeg.current.rotation.x = angle
    if (rightLeg.current) rightLeg.current.rotation.x = -angle
    if (leftArm.current) leftArm.current.rotation.x = -angle * 0.8
    if (rightArm.current) rightArm.current.rotation.x = angle * 0.8
  }

  return (
    <group ref={root} position={CHARACTER.start} rotation-y={CHARACTER.startHeading}>
      {/* Sombra simple bajo los pies */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.36, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <CharacterModel limbs={{ leftLeg, rightLeg, leftArm, rightArm }} />
    </group>
  )
}
