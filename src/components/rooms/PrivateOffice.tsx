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
      <mesh rotation-x={-Math.PI / 2} position={[deskX, 0.012, deskZ + 0.4]}>
        <planeGeometry args={[3.4, 2.8]} />
        <Flat map={textures.rug} />
      </mesh>

      <Desk position={[deskX, 0, deskZ]} width={OFFICE_LAYOUT.desk.width} depth={OFFICE_LAYOUT.desk.depth} />
      <Monitor screen={textures.screen} position={[OFFICE_LAYOUT.computer[0], 0.76, OFFICE_LAYOUT.computer[1]]} />
      <Keyboard position={[OFFICE_LAYOUT.computer[0], 0.76, OFFICE_LAYOUT.computer[1] + 0.25]} />
      <Box size={[0.3, 0.05, 0.22]} position={[deskX + 0.65, 0.785, deskZ]} color="#c9c2b0" />
      <OfficeChair position={[deskX + 0.2, 0, deskZ + 0.62]} rotationY={Math.PI + 0.25} />

      {/* Lámpara de escritorio */}
      <Box size={[0.03, 0.35, 0.03]} position={[deskX - 0.8, 0.93, deskZ - 0.2]} color="#1a1a1a" />
      <Box size={[0.16, 0.06, 0.12]} position={[deskX - 0.75, 1.12, deskZ - 0.15]} color="#2a2420" />
      <pointLight position={[deskX - 0.7, 1.0, deskZ]} color="#ffcf8a" intensity={1.6} distance={3.2} decay={2} />

      <Shelf width={OFFICE_LAYOUT.shelf.width} position={[OFFICE_LAYOUT.shelf.center[0], 0, rect.minZ + 0.22]} />
      <WallScreen texture={textures.plate} width={0.9} height={0.24} position={[-10.2, 2.2, rect.minZ + 0.06]} glow={false} />

      <Sofa position={[OFFICE_LAYOUT.armchair[0], 0, OFFICE_LAYOUT.armchair[1]]} rotationY={Math.PI} width={0.95} color="#3a2420" />
      <Plant position={[OFFICE_LAYOUT.plant[0], 0, OFFICE_LAYOUT.plant[1]]} size={1.1} />

      <CeilingLight position={[-10, 3.18, 6]} color="#ffdcae" intensity={6.5} distance={10} />
    </group>
  )
}
