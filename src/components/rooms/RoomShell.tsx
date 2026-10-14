import { useMemo } from 'react'
import { DOOR_SIZE, WALL_HEIGHT, doorsOf, type RoomDef } from '../../world/building'
import { tileTexture, wallTexture, woodTexture } from '../../world/officeTextures'
import { DOOR_FRAME } from './DoorPanel'
import { Flat } from './props'
import type * as THREE from 'three'

const WAINSCOT = 1.0
const OPENING = DOOR_SIZE.width + DOOR_FRAME * 2

type WallSpec = {
  key: string
  position: [number, number, number]
  rotationY: number
  length: number
  map: THREE.Texture
  /** Centros de los vanos de puerta, en coordenadas locales del muro. */
  openings: number[]
}

/** Divide un muro en tramos que dejan libres los vanos de las puertas. */
function segments(length: number, openings: number[]): { center: number; length: number }[] {
  const cuts = [...openings].sort((a, b) => a - b)
  const result: { center: number; length: number }[] = []
  let start = -length / 2
  for (const center of cuts) {
    const end = center - OPENING / 2
    if (end - start > 0.01) result.push({ center: (start + end) / 2, length: end - start })
    start = center + OPENING / 2
  }
  if (length / 2 - start > 0.01) result.push({ center: (start + length / 2) / 2, length: length / 2 - start })
  return result
}

/**
 * Piso, techo y muros de un cuarto. Cada muro mira hacia dentro y tiene vanos
 * reales donde hay puertas, con dintel arriba. Lambrín de madera oscura abajo.
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
      wall: wallTexture(2, WALL_HEIGHT, wall, room.number + 20),
      wood: woodTexture(room.number + 40),
    }),
    [width, depth, floor, wall, room.number],
  )

  const walls = useMemo<WallSpec[]>(() => {
    const doors = doorsOf(room.id)
    const onWall = (axis: 'x' | 'z', value: number) => doors.filter((d) => d.axis === axis && Math.abs((axis === 'x' ? d.x : d.z) - value) < 0.01)
    return [
      { key: 'n', position: [cx, 0, minZ], rotationY: 0, length: width, map: textures.wall, openings: onWall('z', minZ).map((d) => d.x - cx) },
      { key: 's', position: [cx, 0, maxZ], rotationY: Math.PI, length: width, map: textures.wall, openings: onWall('z', maxZ).map((d) => -(d.x - cx)) },
      { key: 'w', position: [minX, 0, cz], rotationY: Math.PI / 2, length: depth, map: textures.wall, openings: onWall('x', minX).map((d) => -(d.z - cz)) },
      { key: 'e', position: [maxX, 0, cz], rotationY: -Math.PI / 2, length: depth, map: textures.wall, openings: onWall('x', maxX).map((d) => d.z - cz) },
    ]
  }, [room.id, cx, cz, minX, maxX, minZ, maxZ, width, depth, textures.wall])

  const lintelHeight = WALL_HEIGHT - DOOR_SIZE.height - DOOR_FRAME

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

      {walls.map(({ key, position, rotationY, length, map, openings }) => (
        <group key={key} position={position} rotation-y={rotationY}>
          {segments(length, openings).map((segment) => (
            <group key={segment.center} position={[segment.center, 0, 0]}>
              <mesh position={[0, WALL_HEIGHT / 2, 0]}>
                <planeGeometry args={[segment.length, WALL_HEIGHT]} />
                <WallMaterial map={map} length={segment.length} />
              </mesh>
              <mesh position={[0, WAINSCOT / 2, 0.02]}>
                <boxGeometry args={[segment.length, WAINSCOT, 0.04]} />
                <Flat map={textures.wood} />
              </mesh>
              <mesh position={[0, WAINSCOT + 0.02, 0.04]}>
                <boxGeometry args={[segment.length, 0.04, 0.06]} />
                <Flat color="#1d150e" />
              </mesh>
            </group>
          ))}
          {/* Dinteles sobre los vanos */}
          {openings.map((center) => (
            <mesh key={center} position={[center, WALL_HEIGHT - lintelHeight / 2, 0]}>
              <planeGeometry args={[OPENING, lintelHeight]} />
              <WallMaterial map={map} length={OPENING} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/** El muro repite su textura cada 2 m sin importar el largo del tramo. */
function WallMaterial({ map, length }: { map: THREE.Texture; length: number }) {
  const texture = useMemo(() => {
    const clone = map.clone()
    clone.repeat.set(length / 2, map.repeat.y)
    clone.needsUpdate = true
    return clone
  }, [map, length])
  return <Flat map={texture} />
}
