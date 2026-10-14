import { useMemo } from 'react'
import { BREAK_LAYOUT, ROOMS } from '../../world/building'
import { corkTexture, posterTexture, woodTexture } from '../../world/officeTextures'
import { Box, CeilingLight, Flat, OfficeChair, Plant, Sofa, WallScreen } from './props'

/** Comedor / descanso: cocineta, cafetera, mesa, sofá y tablero de corcho personal. */
export function BreakRoom() {
  const { rect } = ROOMS.comedor
  const textures = useMemo(
    () => ({
      wood: woodTexture(66, '#4a3524'),
      cork: corkTexture(67),
      poster: posterTexture(['CI VERDE', '=', 'VIERNES', 'FELIZ'], '#20321f', '#cfe8b8'),
    }),
    [],
  )
  const [cx, cz] = BREAK_LAYOUT.counter.center
  const [tx, tz] = BREAK_LAYOUT.table.center

  return (
    <group>
      {/* Cocineta */}
      <Box size={[BREAK_LAYOUT.counter.width, 0.88, BREAK_LAYOUT.counter.depth]} position={[cx, 0.44, cz]} map={textures.wood} />
      <Box size={[BREAK_LAYOUT.counter.width, 0.04, BREAK_LAYOUT.counter.depth + 0.04]} position={[cx, 0.9, cz]} color="#2a2c30" />
      <Box size={[BREAK_LAYOUT.counter.width, 0.6, 0.35]} position={[cx, 2.1, rect.minZ + 0.18]} map={textures.wood} />
      <Box size={[0.5, 0.08, 0.38]} position={[cx - 1.4, 0.95, cz]} color="#8a8f94" />

      {/* Cafetera con luz piloto */}
      <group position={[BREAK_LAYOUT.coffee[0], 0.92, BREAK_LAYOUT.coffee[1]]}>
        <Box size={[0.28, 0.36, 0.26]} position={[0, 0.18, 0]} color="#151517" />
        <mesh position={[0, 0.1, 0.16]}>
          <cylinderGeometry args={[0.07, 0.06, 0.14, 6]} />
          <Flat color="#3a2a1e" />
        </mesh>
        <mesh position={[0.1, 0.3, 0.131]}>
          <planeGeometry args={[0.025, 0.025]} />
          <meshBasicMaterial color="#ff4a2a" fog={false} />
        </mesh>
        <pointLight position={[0, 0.3, 0.3]} color="#ff7a3a" intensity={0.5} distance={1.4} decay={2} />
      </group>

      {/* Refrigerador */}
      <Box size={[0.8, 1.85, 0.7]} position={[BREAK_LAYOUT.fridge[0], 0.925, BREAK_LAYOUT.fridge[1]]} color="#b8bab6" />
      <Box size={[0.04, 0.4, 0.04]} position={[BREAK_LAYOUT.fridge[0] - 0.3, 1.3, BREAK_LAYOUT.fridge[1] + 0.37]} color="#5a5c60" />

      {/* Mesa con sillas */}
      <Box size={[BREAK_LAYOUT.table.width, 0.05, BREAK_LAYOUT.table.depth]} position={[tx, 0.74, tz]} map={textures.wood} />
      <Box size={[0.08, 0.72, 0.08]} position={[tx, 0.36, tz]} color="#141416" />
      {[-0.45, 0.45].map((dx) => (
        <group key={dx}>
          <OfficeChair position={[tx + dx, 0, tz - 0.75]} />
          <OfficeChair position={[tx + dx, 0, tz + 0.75]} rotationY={Math.PI} />
        </group>
      ))}
      <Box size={[0.1, 0.1, 0.1]} position={[tx + 0.3, 0.82, tz]} color="#7a2a24" />

      <Sofa position={[BREAK_LAYOUT.sofa[0], 0, BREAK_LAYOUT.sofa[1]]} rotationY={-Math.PI / 2} width={2.0} color="#2a3242" />
      <Plant position={[BREAK_LAYOUT.plant[0], 0, BREAK_LAYOUT.plant[1]]} />

      {/* Tablero de corcho (contenido personal) y cartel */}
      <WallScreen
        texture={textures.cork}
        width={1.4}
        height={1.0}
        position={[rect.minX + 0.06, 1.6, BREAK_LAYOUT.corkboard[1]]}
        rotationY={Math.PI / 2}
        glow={false}
      />
      <WallScreen texture={textures.poster} width={0.5} height={0.65} position={[rect.maxX - 0.06, 1.8, -11.8]} rotationY={-Math.PI / 2} glow={false} />

      <CeilingLight position={[0, 3.18, -10]} color="#ffd9a8" intensity={6} distance={9} />
    </group>
  )
}
