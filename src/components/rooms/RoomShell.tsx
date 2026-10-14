import { useMemo } from 'react'
import { WALL_HEIGHT, type RoomDef } from '../../world/building'
import { tileTexture, wallTexture, woodTexture } from '../../world/officeTextures'
import { Flat } from './props'

const WAINSCOT = 1.0

/**
 * Piso, techo y cuatro muros de un cuarto. Cada muro mira hacia dentro, así
 * que desde fuera no tapa la cámara. Incluye lambrín de madera oscura abajo.
 */
export function RoomShell({ room, floor = '#2c2e33', wall = '#3b4048' }: { room: RoomDef; floor?: string; wall?: string }) {
  const { minX, maxX, minZ, maxZ } = room.rect
  const width = maxX - minX
  const depth = maxZ - minZ
  const cx = (minX + maxX) / 2
  const cz = (minZ + maxZ) / 2

  const textures = useMemo(
    () => ({
      floor: tileTexture(width, depth, floor, room.number),
      ceiling: wallTexture(width, depth, '#1d1f22', room.number + 50),
      wallX: wallTexture(width, WALL_HEIGHT, wall, room.number + 20),
      wallZ: wallTexture(depth, WALL_HEIGHT, wall, room.number + 30),
      wood: woodTexture(room.number + 40),
    }),
    [width, depth, floor, wall, room.number],
  )

  const walls = [
    { key: 'n', position: [cx, 0, minZ] as const, rotationY: 0, length: width, map: textures.wallX },
    { key: 's', position: [cx, 0, maxZ] as const, rotationY: Math.PI, length: width, map: textures.wallX },
    { key: 'w', position: [minX, 0, cz] as const, rotationY: Math.PI / 2, length: depth, map: textures.wallZ },
    { key: 'e', position: [maxX, 0, cz] as const, rotationY: -Math.PI / 2, length: depth, map: textures.wallZ },
  ]

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[cx, 0, cz]}>
        <planeGeometry args={[width, depth]} />
        <Flat map={textures.floor} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[cx, WALL_HEIGHT, cz]}>
        <planeGeometry args={[width, depth]} />
        <Flat map={textures.ceiling} />
      </mesh>

      {walls.map(({ key, position, rotationY, length, map }) => (
        <group key={key} position={position} rotation-y={rotationY}>
          <mesh position={[0, WALL_HEIGHT / 2, 0]}>
            <planeGeometry args={[length, WALL_HEIGHT]} />
            <Flat map={map} />
          </mesh>
          {/* Lambrín y moldura */}
          <mesh position={[0, WAINSCOT / 2, 0.02]}>
            <boxGeometry args={[length, WAINSCOT, 0.04]} />
            <Flat map={textures.wood} />
          </mesh>
          <mesh position={[0, WAINSCOT + 0.02, 0.04]}>
            <boxGeometry args={[length, 0.04, 0.06]} />
            <Flat color="#1d150e" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
