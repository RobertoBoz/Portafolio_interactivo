import { useMemo } from 'react'
import { ARCHIVE_LAYOUT, ROOMS } from '../../world/building'
import { PROJECTS } from '../../content/portfolio'
import { signTexture } from '../../world/officeTextures'
import { Box, CeilingLight, FilingCabinet, WallScreen } from './props'

/** Archivo de proyectos: un archivero por proyecto, a ambos lados de un pasillo angosto. */
export function ProjectArchive() {
  const { rect } = ROOMS.almacen
  const labels = useMemo(
    () => ARCHIVE_LAYOUT.cabinets.map((_, i) => signTexture([(PROJECTS[i]?.name ?? '').toUpperCase().slice(0, 16)], '#1a1a1a', '#d9d4c7')),
    [],
  )
  const sign = useMemo(() => signTexture(['ARCHIVO DE PROYECTOS'], '#c9b27a', '#141416'), [])
  const { width, depth, height } = ARCHIVE_LAYOUT.cabinet

  return (
    <group>
      {ARCHIVE_LAYOUT.cabinets.map(([x, z, rotationY], i) => (
        <group key={`${x}${z}`}>
          {labels[i] && (
            <FilingCabinet label={labels[i]} width={width} depth={depth} height={height} position={[x, 0, z]} rotationY={rotationY} />
          )}
          {/* Cajas de archivo encima */}
          <Box size={[0.45, 0.3, 0.35]} position={[x - 0.15, height + 0.15, z]} rotationY={0.2 * (i % 3)} color="#6e5a3e" />
        </group>
      ))}
      <WallScreen texture={sign} width={1.6} height={0.4} position={[rect.maxX - 0.06, 2.3, 1]} rotationY={-Math.PI / 2} glow={false} />
      {/* Escalera de mano recargada al fondo */}
      <Box size={[0.06, 2.2, 0.06]} position={[rect.maxX - 0.4, 1.1, -0.2]} rotationY={0} color="#5a5c60" />
      <Box size={[0.06, 2.2, 0.06]} position={[rect.maxX - 0.4, 1.1, 0.25]} color="#5a5c60" />

      <CeilingLight position={[8, 3.18, 1]} color="#ffe2b8" intensity={4.5} distance={7} flicker />
      <CeilingLight position={[12.5, 3.18, 1]} color="#ffe2b8" intensity={4.5} distance={7} />
    </group>
  )
}
