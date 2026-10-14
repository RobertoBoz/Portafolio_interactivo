import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { ROOMS, SERVER_LAYOUT, WALL_HEIGHT } from '../../world/building'
import { rackTexture, signTexture } from '../../world/officeTextures'
import { Box, CeilingLight, FloorCable, ServerRack, WallScreen } from './props'

const LABELS = ['01 CI/CD', '02 CALIDAD', '03 OPERACIÓN', '04 AUTOMATIZACIÓN']

/** Sala de servidores: cuatro grupos de gabinetes, cada uno una parte de la infraestructura. */
export function ServerRoom() {
  const { rect } = ROOMS.servidores
  const fronts = useMemo(() => [rackTexture(71), rackTexture(72), rackTexture(73)], [])
  const labels = useMemo(() => LABELS.map((label) => signTexture([label], '#9fd0ff', '#0b1520')), [])
  const blink = useRef(0)

  // Los LEDs "parpadean" desplazando la textura de vez en cuando.
  useFrame(({ clock }) => {
    const step = Math.floor(clock.elapsedTime * 3)
    if (step === blink.current) return
    blink.current = step
    fronts.forEach((texture: THREE.Texture, i) => {
      texture.offset.y = ((step + i) % 4) * 0.125
    })
  })

  const { width, depth, height } = SERVER_LAYOUT.rackGroup
  const cabinet = width / 3

  return (
    <group>
      {SERVER_LAYOUT.racks.map(([x, z], i) => (
        <group key={`${x}${z}`}>
          {[-1, 0, 1].map((slot) => (
            <ServerRack
              key={slot}
              front={fronts[(i + slot + 3) % 3] ?? fronts[0]!}
              width={cabinet - 0.02}
              depth={depth}
              height={height}
              position={[x + slot * cabinet, 0, z]}
            />
          ))}
          {labels[i] && <WallScreen texture={labels[i]} width={1.2} height={0.3} position={[x, height + 0.25, z + depth / 2]} glow />}
          <FloorCable from={[x, z - depth / 2]} to={[x, rect.minZ + 0.1]} />
        </group>
      ))}

      {/* Charola de cables en el techo */}
      <Box size={[rect.maxX - rect.minX - 1, 0.08, 0.4]} position={[10, WALL_HEIGHT - 0.35, -9.6]} color="#2a2d33" />
      {/* Aire acondicionado de precisión */}
      <Box size={[1.2, 1.9, 0.7]} position={[rect.maxX - 0.7, 0.95, rect.minZ + 0.5]} color="#c9ccc8" />
      <Box size={[0.9, 0.4, 0.02]} position={[rect.maxX - 0.7, 1.5, rect.minZ + 0.86]} color="#3a3d42" />

      <pointLight position={[10, 2.4, -9.6]} color="#3a6fd1" intensity={3.5} distance={10} decay={1.6} />
      <CeilingLight position={[8, 3.18, -6.5]} color="#a8c4ff" intensity={4} distance={8} flicker />
    </group>
  )
}
