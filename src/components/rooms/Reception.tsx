import { useMemo } from 'react'
import { RECEPTION_LAYOUT, ROOMS } from '../../world/building'
import { codeScreenTexture, signTexture } from '../../world/officeTextures'
import { useGameStore } from '../../store/gameStore'
import { Box, CeilingLight, Desk, DeskClutter, Keyboard, Monitor, OfficeChair, Plant, Sofa, WallScreen } from './props'

/** Recepción: escritorio con la computadora del directorio y la tarjeta de acceso. */
export function Reception() {
  const { rect } = ROOMS.recepcion
  const hasKeycard = useGameStore((state) => state.items.includes('keycard'))
  const textures = useMemo(
    () => ({
      screen: codeScreenTexture('CONTACTO', 12, '#e0af68'),
      sign: signTexture(['RECEPCIÓN']),
    }),
    [],
  )
  const [deskX, deskZ] = RECEPTION_LAYOUT.desk.center

  return (
    <group>
      <Desk position={[deskX, 0, deskZ]} width={RECEPTION_LAYOUT.desk.width} depth={RECEPTION_LAYOUT.desk.depth} height={0.8} rotationY={Math.PI} />
      <Monitor screen={textures.screen} position={[RECEPTION_LAYOUT.computer[0], 0.8, RECEPTION_LAYOUT.computer[1] + 0.12]} />
      <Keyboard position={[RECEPTION_LAYOUT.computer[0], 0.8, RECEPTION_LAYOUT.computer[1] + 0.36]} />
      {/* Tarjetero con tarjetas de presentación */}
      <group position={[RECEPTION_LAYOUT.businessCards[0], 0.8, RECEPTION_LAYOUT.businessCards[1]]}>
        <Box size={[0.12, 0.04, 0.08]} position={[0, 0.02, 0]} color="#1a1a1c" />
        <Box size={[0.09, 0.05, 0.005]} position={[0, 0.05, 0]} color="#e8e4d8" />
      </group>
      <DeskClutter position={[deskX + 0.9, 0.8, deskZ]} seed={2} />
      <OfficeChair position={[deskX - 0.4, 0, deskZ - 0.75]} />

      {!hasKeycard && (
        <group position={[RECEPTION_LAYOUT.keycard[0], 0.81, RECEPTION_LAYOUT.keycard[1]]} rotation-y={0.4}>
          <Box size={[0.1, 0.008, 0.065]} position={[0, 0, 0]} color="#3d7bd9" />
          <mesh position={[0, 0.1, 0]}>
            <octahedronGeometry args={[0.03, 0]} />
            <meshBasicMaterial color="#8cc4ff" fog={false} />
          </mesh>
          <pointLight color="#5fa8ff" intensity={0.6} distance={1.4} decay={2} position={[0, 0.15, 0]} />
        </group>
      )}

      <Sofa position={[RECEPTION_LAYOUT.sofa[0], 0, RECEPTION_LAYOUT.sofa[1]]} rotationY={Math.PI / 2} width={2.0} color="#26201c" />
      <Plant position={[RECEPTION_LAYOUT.plant[0], 0, RECEPTION_LAYOUT.plant[1]]} />
      <WallScreen texture={textures.sign} width={1.6} height={0.4} position={[-8.6, 2.3, rect.minZ + 0.06]} glow={false} />

      <CeilingLight position={[-8, 3.18, 11]} intensity={7} distance={9} />
    </group>
  )
}
