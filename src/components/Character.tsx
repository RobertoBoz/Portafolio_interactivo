import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { CHARACTER } from '../world/building'
import { resolveMove } from '../world/collision'
import { findNearbyInteraction } from '../world/interactions'
import { player } from '../world/player'
import type { Control } from '../world/controls'
import { isBusy, useGameStore } from '../store/gameStore'
import { CharacterModel } from './CharacterModel'

/** Qué tan rápido alcanza la velocidad objetivo; bajo = movimiento pesado. */
const ACCELERATION = 5

/**
 * Personaje con controles tipo tanque:
 * W/S avanzan y retroceden en la dirección a la que mira, A/D lo giran.
 */
export function Character() {
  const root = useRef<THREE.Group>(null)
  const leftLeg = useRef<THREE.Group>(null)
  const rightLeg = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)

  const speed = useRef(0)
  const walkPhase = useRef(0)
  const spawnVersion = useRef(-1)

  const [, getKeys] = useKeyboardControls<Control>()

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const state = useGameStore.getState()

    // Aparecer en otro cuarto después de cruzar una puerta.
    if (state.spawn.version !== spawnVersion.current) {
      spawnVersion.current = state.spawn.version
      player.room = state.spawn.room
      player.x = state.spawn.x
      player.z = state.spawn.z
      player.heading = state.spawn.heading
      speed.current = 0
    }

    let turn = 0
    let move = 0
    if (!isBusy(state)) {
      const keys = getKeys()
      turn = Number(keys.left) - Number(keys.right)
      move = Number(keys.forward) - Number(keys.backward)
    }

    player.heading += turn * CHARACTER.turnSpeed * delta
    const targetSpeed = move > 0 ? CHARACTER.walkSpeed : move < 0 ? -CHARACTER.backSpeed : 0
    speed.current = THREE.MathUtils.damp(speed.current, targetSpeed, ACCELERATION, delta)
    if (Math.abs(speed.current) < 0.01) speed.current = 0

    const step = speed.current * delta
    const next = resolveMove(
      player.room,
      { x: player.x, z: player.z },
      { x: player.x + Math.sin(player.heading) * step, z: player.z + Math.cos(player.heading) * step },
      CHARACTER.radius,
    )
    player.x = next.x
    player.z = next.z

    if (root.current) {
      root.current.position.set(player.x, 0, player.z)
      root.current.rotation.y = player.heading
    }

    animateLimbs(delta)

    if (!state.transitioning) {
      const nearby = findNearbyInteraction(
        player.room,
        player,
        player.heading,
        (item) => item.action.type === 'pickup' && state.items.includes(item.action.item),
      )
      const nearbyId = nearby?.id ?? null
      if (nearbyId !== state.nearby) state.setNearby(nearbyId)
    }
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
    <group ref={root}>
      {/* Sombra simple bajo los pies */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.36, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <CharacterModel limbs={{ leftLeg, rightLeg, leftArm, rightArm }} />
    </group>
  )
}
