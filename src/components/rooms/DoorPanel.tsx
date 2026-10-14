import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DOOR_SIZE, ROOMS, doorNormal, otherSide, type DoorDef, type RoomId } from '../../world/building'
import { signTexture, woodTexture } from '../../world/officeTextures'
import { useGameStore } from '../../store/gameStore'
import { Box } from './props'

export const DOOR_FRAME = 0.09
const OPEN_ANGLE = 1.45
const OPEN_MS = 520

/**
 * Puerta vista desde `room`. La hoja gira sobre su bisagra (borde izquierdo)
 * hacia el otro lado del vano, que es un hueco oscuro en el muro. Si está
 * cerrada, la hoja se sacude. Incluye placa con el cuarto de destino y luz de
 * estado (verde = abierta, roja = cerrada).
 */
export function DoorPanel({ door, room }: { door: DoorDef; room: RoomId }) {
  const normal = doorNormal(door, room)
  const destination = ROOMS[otherSide(door, room)]
  const unlocked = useGameStore((state) => state.unlockedDoors.includes(door.id))
  const open = door.lock === 'none' || (door.lock === 'keycard' && unlocked)

  const hinge = useRef<THREE.Group>(null)
  const led = useRef<THREE.MeshBasicMaterial>(null)
  const textures = useMemo(
    () => ({
      wood: woodTexture(door.id.length + 60, '#3b2a1c'),
      sign: signTexture([`${destination.number}  ${destination.name.toUpperCase()}`]),
    }),
    [door.id, destination.number, destination.name],
  )

  useFrame(({ clock }) => {
    if (led.current) {
      if (open) led.current.color.set('#35ff7a')
      else led.current.color.set(Math.sin(clock.elapsedTime * 3) > 0 ? '#ff2a1a' : '#4a0a06')
    }
    const leaf = hinge.current
    if (!leaf) return
    const animation = useGameStore.getState().doorAnimation
    if (!animation || animation.doorId !== door.id) {
      leaf.rotation.y = 0
      leaf.position.z = 0
      return
    }
    const elapsed = performance.now() - animation.startedAt
    if (animation.kind === 'open') {
      const t = Math.min(elapsed / OPEN_MS, 1)
      // Arranque lento, como una puerta pesada.
      leaf.rotation.y = THREE.MathUtils.smootherstep(t, 0, 1) * OPEN_ANGLE
    } else {
      const fade = Math.max(0, 1 - elapsed / 500)
      leaf.rotation.y = Math.sin(elapsed / 18) * 0.035 * fade
      leaf.position.z = Math.sin(elapsed / 25) * 0.01 * fade
    }
  })

  const { width, height } = DOOR_SIZE
  const rotationY = Math.atan2(normal.x, normal.z)

  return (
    <group position={[door.x, 0, door.z]} rotation-y={rotationY}>
      {/* Hueco oscuro detrás del vano */}
      <mesh position={[0, height / 2, -0.65]}>
        <boxGeometry args={[width, height, 1.3]} />
        <meshBasicMaterial color="#020203" side={THREE.BackSide} />
      </mesh>

      {/* Marco */}
      <Box size={[DOOR_FRAME, height + DOOR_FRAME, 0.16]} position={[-(width / 2 + DOOR_FRAME / 2), (height + DOOR_FRAME) / 2, 0]} color="#141416" />
      <Box size={[DOOR_FRAME, height + DOOR_FRAME, 0.16]} position={[width / 2 + DOOR_FRAME / 2, (height + DOOR_FRAME) / 2, 0]} color="#141416" />
      <Box size={[width + DOOR_FRAME * 2, DOOR_FRAME, 0.16]} position={[0, height + DOOR_FRAME / 2, 0]} color="#141416" />

      {/* Hoja: el grupo es la bisagra; la hoja abre hacia el otro cuarto (-Z local) */}
      <group ref={hinge} position={[-width / 2, 0, -0.03]}>
        <group position={[width / 2, height / 2, 0]}>
          <Box size={[width - 0.02, height - 0.02, 0.05]} position={[0, 0, 0]} map={textures.wood} />
          <Box size={[width - 0.3, 0.6, 0.012]} position={[0, 0.45, 0.03]} color="#2c1f15" />
          <Box size={[width - 0.3, 0.6, 0.012]} position={[0, -0.45, 0.03]} color="#2c1f15" />
          <Box size={[0.16, 0.035, 0.06]} position={[width / 2 - 0.14, -0.1, 0.05]} color="#a8a49a" />
        </group>
      </group>

      {/* Placa con el nombre del cuarto */}
      <mesh position={[0, height + 0.32, 0.01]}>
        <planeGeometry args={[0.96, 0.24]} />
        <meshLambertMaterial map={textures.sign} />
      </mesh>

      {/* Lector / luz de estado */}
      <group position={[width / 2 + 0.3, 1.25, 0.05]}>
        <Box size={[0.13, 0.2, 0.04]} position={[0, 0, 0]} color="#151618" />
        <mesh position={[0, 0.06, 0.022]}>
          <planeGeometry args={[0.03, 0.03]} />
          <meshBasicMaterial ref={led} color="#ff2a1a" fog={false} />
        </mesh>
      </group>
    </group>
  )
}
