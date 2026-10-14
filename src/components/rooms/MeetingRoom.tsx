import { useMemo } from 'react'
import { MEETING_LAYOUT, ROOMS } from '../../world/building'
import { posterTexture, slideTexture, whiteboardTexture, woodTexture } from '../../world/officeTextures'
import { Box, CeilingLight, OfficeChair, Plant, WallScreen } from './props'

/** Sala de juntas: mesa larga, proyector con la experiencia y pizarrón del equipo. */
export function MeetingRoom() {
  const { rect } = ROOMS.juntas
  const textures = useMemo(
    () => ({
      wood: woodTexture(55, '#3d2a1b'),
      slide: slideTexture(),
      board: whiteboardTexture('equipo', 56),
      poster: posterTexture(['REVISA', 'ANTES DE', 'HACER', 'MERGE'], '#1c2a3a', '#d9d4c7'),
    }),
    [],
  )
  const [tx, tz] = MEETING_LAYOUT.table.center
  const { width, depth } = MEETING_LAYOUT.table
  const seatsX = [-1.5, -0.5, 0.5, 1.5]

  return (
    <group>
      {/* Mesa */}
      <Box size={[width, 0.07, depth]} position={[tx, 0.74, tz]} map={textures.wood} />
      <Box size={[width - 0.8, 0.7, 0.12]} position={[tx, 0.36, tz]} color="#1a1410" />
      <Box size={[0.3, 0.04, 0.3]} position={[tx + 0.6, 0.79, tz]} color="#1a1a1c" />
      {seatsX.map((dx) => (
        <group key={dx}>
          <OfficeChair position={[tx + dx, 0, tz - depth / 2 - 0.35]} />
          <OfficeChair position={[tx + dx, 0, tz + depth / 2 + 0.35]} rotationY={Math.PI} />
        </group>
      ))}

      {/* Proyector y pantalla en el muro norte */}
      <WallScreen texture={textures.slide} width={2.4} height={1.5} position={[MEETING_LAYOUT.projector[0], 1.75, rect.minZ + 0.06]} />
      <Box size={[0.3, 0.12, 0.3]} position={[tx, 2.95, tz]} color="#202124" />
      <pointLight position={[MEETING_LAYOUT.projector[0], 1.8, rect.minZ + 1]} color="#cfd8ff" intensity={1.4} distance={4} decay={2} />

      {/* Pizarrón en el muro este */}
      <WallScreen
        texture={textures.board}
        width={1.8}
        height={1.1}
        position={[rect.maxX - 0.06, 1.6, MEETING_LAYOUT.whiteboard[1]]}
        rotationY={-Math.PI / 2}
        glow={false}
      />
      <WallScreen texture={textures.poster} width={0.5} height={0.65} position={[rect.minX + 0.06, 1.7, -8]} rotationY={Math.PI / 2} glow={false} />

      {MEETING_LAYOUT.plants.map(([x, z]) => (
        <Plant key={x} position={[x, 0, z]} />
      ))}

      <CeilingLight position={[tx, 3.18, tz]} color="#ffe2b8" intensity={6} distance={9} flicker />
    </group>
  )
}
