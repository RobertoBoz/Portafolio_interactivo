import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { CHARACTER } from '../world/building'
import { resolveMove } from '../world/collision'
import { findNearbyInteraction } from '../world/interactions'
import { player } from '../world/player'
import type { Control } from '../world/controls'
import { isBusy, useGameStore } from '../store/gameStore'

const FIRST_PERSON = {
  walkSpeed: 2.2,
  backSpeed: 1.6,
  strafeSpeed: 1.8,
  keyTurnSpeed: 2.2,
  acceleration: 10,
  mouseRadiansPerPixel: 0.0022,
  maxPitch: 1.2,
  /** Coseno mínimo para considerar que un objeto está "frente" a la mirada. */
  minFacing: 0.72,
} as const

/** Pesado y lento, como los survival horror clásicos. */
const CLASSIC_ACCELERATION = 5

/**
 * Mueve al jugador en ambos modos de cámara, resuelve colisiones y detecta el
 * objeto interactuable al alcance. No dibuja nada.
 */
export function PlayerController() {
  const [, getKeys] = useKeyboardControls<Control>()
  const spawnVersion = useRef(-1)
  const strafe = useRef(0)

  // Mirar con el ratón en primera persona.
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (!document.pointerLockElement) return
      const state = useGameStore.getState()
      if (state.settings.cameraMode !== 'firstPerson' || isBusy(state)) return
      const k = FIRST_PERSON.mouseRadiansPerPixel * state.settings.mouseSensitivity
      player.heading -= event.movementX * k
      player.pitch = THREE.MathUtils.clamp(player.pitch - event.movementY * k, -FIRST_PERSON.maxPitch, FIRST_PERSON.maxPitch)
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const state = useGameStore.getState()
    const firstPerson = state.settings.cameraMode === 'firstPerson'

    // Aparecer en otro lugar después de cruzar una puerta o volver al lobby.
    if (state.spawn.version !== spawnVersion.current) {
      spawnVersion.current = state.spawn.version
      player.room = state.spawn.room
      player.x = state.spawn.x
      player.z = state.spawn.z
      player.heading = state.spawn.heading
      player.pitch = 0
      player.speed = 0
      strafe.current = 0
    }

    const busy = isBusy(state)
    const keys = busy ? null : getKeys()
    const forwardInput = keys ? Number(keys.forward) - Number(keys.backward) : 0
    const strafeInput = keys ? Number(keys.strafeRight) - Number(keys.strafeLeft) : 0
    const turnInput = keys ? Number(keys.turnLeft) - Number(keys.turnRight) : 0

    let stepX = 0
    let stepZ = 0

    if (firstPerson) {
      player.heading += turnInput * FIRST_PERSON.keyTurnSpeed * delta
      const target = forwardInput > 0 ? FIRST_PERSON.walkSpeed : forwardInput < 0 ? -FIRST_PERSON.backSpeed : 0
      player.speed = THREE.MathUtils.damp(player.speed, target, FIRST_PERSON.acceleration, delta)
      strafe.current = THREE.MathUtils.damp(strafe.current, strafeInput * FIRST_PERSON.strafeSpeed, FIRST_PERSON.acceleration, delta)
      const sin = Math.sin(player.heading)
      const cos = Math.cos(player.heading)
      // Derecha del jugador = (-cos, sin).
      stepX = (sin * player.speed - cos * strafe.current) * delta
      stepZ = (cos * player.speed + sin * strafe.current) * delta
    } else {
      // Control tipo tanque: A/D y flechas giran.
      const turn = turnInput - strafeInput
      player.heading += turn * CHARACTER.turnSpeed * delta
      const target = forwardInput > 0 ? CHARACTER.walkSpeed : forwardInput < 0 ? -CHARACTER.backSpeed : 0
      player.speed = THREE.MathUtils.damp(player.speed, target, CLASSIC_ACCELERATION, delta)
      stepX = Math.sin(player.heading) * player.speed * delta
      stepZ = Math.cos(player.heading) * player.speed * delta
    }
    if (Math.abs(player.speed) < 0.01) player.speed = 0

    if (stepX !== 0 || stepZ !== 0) {
      const next = resolveMove(player.room, player, { x: player.x + stepX, z: player.z + stepZ }, CHARACTER.radius)
      player.x = next.x
      player.z = next.z
    }

    if (!state.transitioning && !state.doorAnimation) {
      const nearby = findNearbyInteraction(
        player.room,
        player,
        player.heading,
        (item) => item.action.type === 'pickup' && state.items.includes(item.action.item),
        firstPerson ? FIRST_PERSON.minFacing : 0.35,
      )
      const nearbyId = nearby?.id ?? null
      if (nearbyId !== state.nearby) state.setNearby(nearbyId)
    }
  })

  return null
}
