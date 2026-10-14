import { useMemo } from 'react'
import { DEV_LAYOUT, ROOMS } from '../../world/building'
import { STACK } from '../../content/portfolio'
import { codeScreenTexture, dashboardTexture } from '../../world/officeTextures'
import { CeilingLight, Desk, DeskClutter, FloorCable, Keyboard, Monitor, OfficeChair, Plant, WallScreen } from './props'

const ACCENTS = ['#7fd1ff', '#9ece6a', '#e0af68', '#c792ea', '#ff9e64', '#7dcfff']

/** Desarrollo: seis estaciones de trabajo; cada una muestra una categoría del stack. */
export function Development() {
  const { rect } = ROOMS.desarrollo
  const screens = useMemo(
    () =>
      STACK.map((group, i) => codeScreenTexture(group.title.split(' ')[0] ?? group.id, 200 + i, ACCENTS[i % ACCENTS.length])),
    [],
  )
  const dashboards = useMemo(() => [dashboardTexture(301), dashboardTexture(302)], [])
  const { width, depth } = DEV_LAYOUT.deskSize

  return (
    <group>
      {DEV_LAYOUT.desks.map(([x, z], i) => {
        const screen = screens[i]
        return (
          <group key={`${x}${z}`}>
            {/* El monitor mira al sur (+Z), hacia donde se para el personaje */}
            <Desk position={[x, 0, z]} width={width} depth={depth} />
            {screen && <Monitor screen={screen} position={[x - 0.2, 0.76, z + 0.06]} />}
            <Keyboard position={[x - 0.2, 0.76, z + 0.3]} />
            <DeskClutter position={[x, 0.76, z]} seed={i} />
            <FloorCable from={[x - 0.2, z - 0.35]} to={[x - 0.2, z - 1.1]} />
            <OfficeChair position={[x + 0.25, 0, z + 0.62]} rotationY={Math.PI + 0.3} />
          </group>
        )
      })}

      {/* Televisiones con paneles en el muro oeste */}
      {dashboards.map((texture, i) => (
        <WallScreen
          key={i}
          texture={texture}
          width={1.5}
          height={0.9}
          position={[i === 0 ? -12.6 : -8.4, 1.95, rect.minZ + 0.07]}
        />
      ))}
      <pointLight position={[-10.5, 1.9, rect.minZ + 0.8]} color="#3a8fd1" intensity={1.2} distance={4} decay={2} />

      {DEV_LAYOUT.plants.map(([x, z]) => (
        <Plant key={z} position={[x, 0, z]} />
      ))}

      <CeilingLight position={[-10.2, 3.18, -2.7]} color="#d6e4ff" intensity={7} distance={10} flicker />
      <CeilingLight position={[-10.2, 3.18, 1.2]} color="#d6e4ff" intensity={7} distance={10} />
    </group>
  )
}
