import { useMemo } from 'react'
import { LOBBY_LAYOUT, ROOMS } from '../../world/building'
import { codeScreenTexture, mottoTexture, rugTexture, woodTexture } from '../../world/officeTextures'
import { Box, CeilingLight, Flat, Monitor, Plant, Sofa, WallScreen } from './props'

const DESK_SEGMENTS = 7
const DESK_ARC = 1.6 // radianes que abarca el mostrador
const DESK_HEIGHT = 1.05

/** Lobby: mostrador curvo con la terminal, muro "Build · Ship · Improve", sala de espera y entrada de vidrio. */
export function Lobby() {
  const { rect } = ROOMS.lobby
  const textures = useMemo(
    () => ({
      motto: mottoTexture(),
      wood: woodTexture(77, '#4a3524'),
      rug: rugTexture(),
      terminal: codeScreenTexture('WELCOME', 91, '#9ece6a'),
    }),
    [],
  )

  const { center, radius } = LOBBY_LAYOUT.desk
  const segmentWidth = 2 * radius * Math.sin(DESK_ARC / DESK_SEGMENTS / 2) + 0.02

  return (
    <group>
      {/* Mostrador curvo hecho de segmentos */}
      {Array.from({ length: DESK_SEGMENTS }, (_, i) => {
        const angle = -DESK_ARC / 2 + (DESK_ARC / DESK_SEGMENTS) * (i + 0.5)
        const x = center[0] + Math.sin(angle) * radius
        const z = center[1] + Math.cos(angle) * radius
        return (
          <group key={i} position={[x, 0, z]} rotation-y={angle}>
            <Box size={[segmentWidth, DESK_HEIGHT, 0.55]} position={[0, DESK_HEIGHT / 2, -0.25]} map={textures.wood} />
            <Box size={[segmentWidth, 0.05, 0.75]} position={[0, DESK_HEIGHT + 0.025, -0.3]} color="#1a1b1e" />
            {/* Tira de LED cálida al pie del mostrador */}
            <mesh position={[0, 0.06, 0.04]}>
              <boxGeometry args={[segmentWidth, 0.03, 0.02]} />
              <meshBasicMaterial color="#ffb45a" fog={false} />
            </mesh>
          </group>
        )
      })}
      <Monitor screen={textures.terminal} position={[LOBBY_LAYOUT.terminal[0], DESK_HEIGHT + 0.05, LOBBY_LAYOUT.terminal[2] - 0.25]} />
      <pointLight position={[0, 0.3, -3.1]} color="#ffb45a" intensity={1.6} distance={3.5} decay={2} />

      {/* Muro con el lema */}
      <WallScreen texture={textures.motto} width={3.4} height={2.2} position={[0, 2.0, rect.minZ + 0.06]} glow={false} />

      {LOBBY_LAYOUT.deskPlants.map(([x, z]) => (
        <Plant key={x} position={[x, 0, z]} />
      ))}

      {/* Sala de espera */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, LOBBY_LAYOUT.coffeeTable[1]]}>
        <planeGeometry args={[4.2, 3.2]} />
        <Flat map={textures.rug} />
      </mesh>
      {LOBBY_LAYOUT.sofas.map(([x, z]) => (
        <Sofa key={x} position={[x, 0, z]} rotationY={x < 0 ? Math.PI / 2 : -Math.PI / 2} width={2.0} />
      ))}
      <Box size={[1.0, 0.4, 0.7]} position={[LOBBY_LAYOUT.coffeeTable[0], 0.2, LOBBY_LAYOUT.coffeeTable[1]]} map={textures.wood} />
      <Box size={[0.18, 0.12, 0.18]} position={[0.15, 0.46, LOBBY_LAYOUT.coffeeTable[1] - 0.1]} color="#2a2c30" />

      {/* Entrada de vidrio */}
      <group position={[LOBBY_LAYOUT.entrance[0], 0, rect.maxZ - 0.04]} rotation-y={Math.PI}>
        <Box size={[3.2, 0.1, 0.12]} position={[0, 2.5, 0]} color="#101113" />
        {[-1.55, 0, 1.55].map((x) => (
          <Box key={x} size={[0.08, 2.5, 0.12]} position={[x, 1.25, 0]} color="#101113" />
        ))}
        {[-0.78, 0.78].map((x) => (
          <mesh key={x} position={[x, 1.25, 0.01]}>
            <planeGeometry args={[1.45, 2.4]} />
            <meshBasicMaterial color="#0b1622" />
          </mesh>
        ))}
        <Box size={[0.04, 0.5, 0.06]} position={[-0.12, 1.1, 0.06]} color="#9a9c98" />
        <Box size={[0.04, 0.5, 0.06]} position={[0.12, 1.1, 0.06]} color="#9a9c98" />
      </group>
      <pointLight position={[0, 1.6, rect.maxZ - 0.6]} color="#4f7bb3" intensity={1.2} distance={4} decay={2} />

      {LOBBY_LAYOUT.planters.map(([x, z]) => (
        <Plant key={x} position={[x, 0, z]} size={1.25} />
      ))}

      <CeilingLight position={[0, 3.18, -1.5]} intensity={9} distance={12} />
      <CeilingLight position={[0, 3.18, 3.5]} intensity={6} distance={10} />
      <CeilingLight position={[0, 3.18, 8]} intensity={7} distance={11} flicker />
    </group>
  )
}
