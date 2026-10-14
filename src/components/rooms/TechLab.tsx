import { useMemo } from 'react'
import { LAB_LAYOUT, ROOMS } from '../../world/building'
import { codeScreenTexture, posterTexture, whiteboardTexture } from '../../world/officeTextures'
import { Box, CeilingLight, Desk, DeskClutter, Keyboard, Monitor, OfficeChair, Shelf, WallScreen } from './props'

/** Laboratorio técnico: pizarrón de arquitectura, terminal de decisiones y banco de pruebas. */
export function TechLab() {
  const { rect } = ROOMS.diseno
  const textures = useMemo(
    () => ({
      board: whiteboardTexture('arquitectura', 91),
      terminal: codeScreenTexture('ADR-012', 92, '#e0af68'),
      device: codeScreenTexture('BUILD', 93, '#9ece6a'),
      poster: posterTexture(['MIDE', 'ANTES DE', 'OPTIMIZAR'], '#3a1c1c', '#f0d0c0'),
    }),
    [],
  )
  const [bx, bz] = LAB_LAYOUT.bench.center
  const [dx, dz] = LAB_LAYOUT.terminalDesk.center

  return (
    <group>
      {/* Pizarrón en el muro sur */}
      <WallScreen
        texture={textures.board}
        width={2.2}
        height={1.3}
        position={[LAB_LAYOUT.whiteboard[0], 1.6, rect.maxZ - 0.06]}
        rotationY={Math.PI}
        glow={false}
      />
      <WallScreen texture={textures.poster} width={0.5} height={0.65} position={[7.6, 1.7, rect.maxZ - 0.06]} rotationY={Math.PI} glow={false} />

      {/* Terminal de decisiones: el monitor mira al norte, hacia el centro del cuarto */}
      <Desk position={[dx, 0, dz]} width={LAB_LAYOUT.terminalDesk.width} depth={LAB_LAYOUT.terminalDesk.depth} rotationY={Math.PI} />
      <Monitor screen={textures.terminal} position={[LAB_LAYOUT.terminal[0], 0.76, LAB_LAYOUT.terminal[1] - 0.05]} rotationY={Math.PI} />
      <Keyboard position={[LAB_LAYOUT.terminal[0], 0.76, LAB_LAYOUT.terminal[1] - 0.3]} rotationY={Math.PI} />
      <OfficeChair position={[dx + 0.2, 0, dz - 0.75]} rotationY={0.2} />

      {/* Banco de pruebas con dispositivos y prototipos */}
      <Box size={[LAB_LAYOUT.bench.width, 0.06, LAB_LAYOUT.bench.depth]} position={[bx, 0.9, bz]} color="#3a3d42" />
      <Box size={[LAB_LAYOUT.bench.width - 0.1, 0.86, LAB_LAYOUT.bench.depth - 0.1]} position={[bx, 0.43, bz]} color="#24272c" />
      {[-0.8, -0.45, -0.1].map((x, i) => (
        <group key={x} position={[bx + x, 0.94, bz - 0.1]} rotation-x={-0.25}>
          <Box size={[0.1, 0.18, 0.012]} position={[0, 0.09, 0]} color="#111214" />
          <mesh position={[0, 0.09, 0.007]}>
            <planeGeometry args={[0.085, 0.155]} />
            <meshBasicMaterial map={textures.device} color={i === 1 ? '#bfe0ff' : '#ffffff'} fog={false} />
          </mesh>
        </group>
      ))}
      <Box size={[0.4, 0.03, 0.3]} position={[bx + 0.5, 0.945, bz + 0.1]} color="#1f5a2a" />
      <Box size={[0.25, 0.18, 0.2]} position={[bx + 0.85, 1.02, bz - 0.15]} color="#8c8672" />
      <DeskClutter position={[bx, 0.93, bz + 0.15]} seed={5} />
      <pointLight position={[bx, 1.8, bz]} color="#9fd0ff" intensity={1.6} distance={3.5} decay={2} />

      <Shelf width={1.6} position={[LAB_LAYOUT.shelf[0], 0, rect.minZ + 0.22]} />

      <CeilingLight position={[10, 3.18, 6]} color="#e6f0ff" intensity={6} distance={9} />
    </group>
  )
}
