import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { DOOR_SIZE, ROOMS, doorNormal, otherSide, type DoorDef, type RoomId } from '../../world/building'
import { signTexture, woodTexture } from '../../world/officeTextures'
import { useGameStore } from '../../store/gameStore'
import { Box } from './props'

const FRAME = 0.08

/**
 * Puerta vista desde `room`: marco, hoja de madera, letrero con el cuarto de
 * destino y una luz de estado (verde = abierta, roja = cerrada).
 */
export function DoorPanel({ door, room }: { door: DoorDef; room: RoomId }) {
  const normal = doorNormal(door, room)
  const destination = ROOMS[otherSide(door, room)]
  const unlocked = useGameStore((state) => state.unlockedDoors.includes(door.id))
  const open = door.lock === 'none' || (door.lock === 'keycard' && unlocked)

  const led = useRef<THREE.MeshBasicMaterial>(null)
  const textures = useMemo(
    () => ({
      wood: woodTexture(door.id.length + 60, '#3b2a1c'),
      sign: signTexture([`${destination.number}  ${destination.name.toUpperCase()}`]),
    }),
    [door.id, destination.number, destination.name],
  )

  useFrame(({ clock }) => {
    if (!led.current) return
    if (open) led.current.color.set('#35ff7a')
    else led.current.color.set(Math.sin(clock.elapsedTime * 3) > 0 ? '#ff2a1a' : '#4a0a06')
  })

  const { width, height } = DOOR_SIZE
  const rotationY = Math.atan2(normal.x, normal.z)

  return (
    <group position={[door.x + normal.x * 0.05, 0, door.z + normal.z * 0.05]} rotation-y={rotationY}>
      <Box size={[FRAME, height + FRAME, 0.1]} position={[-(width / 2 + FRAME / 2), height / 2, 0]} color="#141416" />
      <Box size={[FRAME, height + FRAME, 0.1]} position={[width / 2 + FRAME / 2, height / 2, 0]} color="#141416" />
      <Box size={[width + FRAME * 2, FRAME, 0.1]} position={[0, height + FRAME / 2, 0]} color="#141416" />
      <Box size={[width, height, 0.05]} position={[0, height / 2, -0.01]} map={textures.wood} />
      <Box size={[0.16, 0.035, 0.05]} position={[width / 2 - 0.14, 1.0, 0.04]} color="#a8a49a" />

      <mesh position={[0, height + 0.28, 0.01]}>
        <planeGeometry args={[0.96, 0.24]} />
        <meshLambertMaterial map={textures.sign} />
      </mesh>

      <group position={[width / 2 + 0.3, 1.25, 0.03]}>
        <Box size={[0.13, 0.2, 0.04]} position={[0, 0, 0]} color="#151618" />
        <mesh position={[0, 0.06, 0.022]}>
          <planeGeometry args={[0.03, 0.03]} />
          <meshBasicMaterial ref={led} color="#ff2a1a" fog={false} />
        </mesh>
      </group>
    </group>
  )
}
