import { useMemo } from 'react'
import { OFFICE_LAYOUT, ROOMS } from '../../world/building'
import { codeScreenTexture, rugTexture, signTexture } from '../../world/officeTextures'
import { Box, CeilingLight, Desk, Flat, Keyboard, Monitor, OfficeChair, Plant, Shelf, Sofa, WallScreen } from './props'

/** Oficina privada: escritorio con la computadora ("sobre mí") y el librero con el expediente. */
export function PrivateOffice() {
  const { rect } = ROOMS.oficina
  const textures = useMemo(
    () => ({
      screen: codeScreenTexture('ABOUT', 404, '#c792ea'),
      rug: rugTexture(9),
      plate: signTexture(['TECH LEAD', 'MOBILE'], '#d9c48a', '#1a1612'),
    }),
    [],
  )
  const [deskX, deskZ] = OFFICE_LAYOUT.desk.center

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[deskX + 0.3, 0.012, deskZ]}>
        <planeGeometry args={[3.2, 3.6]} />
        <Flat map={textures.rug} />
      </mesh>

      {/* Escritorio orientado hacia la puerta (+X) */}
      <Desk position={[deskX, 0, deskZ]} width={OFFICE_LAYOUT.desk.depth} depth={OFFICE_LAYOUT.desk.width} rotationY={-Math.PI / 2} />
      <Monitor screen={textures.screen} position={[OFFICE_LAYOUT.computer[0], 0.76, OFFICE_LAYOUT.computer[1]]} rotationY={Math.PI / 2} />
      <Keyboard position={[OFFICE_LAYOUT.computer[0] + 0.2, 0.76, OFFICE_LAYOUT.computer[1]]} rotationY={Math.PI / 2} />
      <Box size={[0.22, 0.06, 0.3]} position={[deskX + 0.15, 0.79, deskZ - 0.65]} color="#c9c2b0" />
      <OfficeChair position={[deskX - 0.75, 0, deskZ + 0.2]} rotationY={Math.PI / 2} />

      <Shelf width={OFFICE_LAYOUT.shelf.width} position={[OFFICE_LAYOUT.shelf.center[0], 0, rect.minZ + 0.22]} />
      <WallScreen texture={textures.plate} width={0.9} height={0.24} position={[-12.2, 2.1, rect.minZ + 0.06]} glow={false} />

      <Sofa position={[OFFICE_LAYOUT.armchair[0], 0, OFFICE_LAYOUT.armchair[1]]} rotationY={Math.PI} width={0.95} color="#3a2420" />
      <Plant position={[OFFICE_LAYOUT.plant[0], 0, OFFICE_LAYOUT.plant[1]]} size={1.1} />

      {/* Lámpara de escritorio */}
      <Box size={[0.03, 0.35, 0.03]} position={[deskX - 0.1, 0.93, deskZ + 0.8]} color="#1a1a1a" />
      <Box size={[0.16, 0.06, 0.12]} position={[deskX - 0.05, 1.12, deskZ + 0.8]} color="#2a2420" />
      <pointLight position={[deskX, 1.0, deskZ + 0.7]} color="#ffcf8a" intensity={1.4} distance={3} decay={2} />

      <CeilingLight position={[-10, 3.18, 6]} color="#ffdcae" intensity={4.5} distance={9} />
    </group>
  )
}
