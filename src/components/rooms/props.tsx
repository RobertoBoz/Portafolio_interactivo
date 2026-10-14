import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import type { Vec3 } from '../../world/building'
import { ps1VertexSnap } from '../../world/ps1Material'
import { fabricTexture, woodTexture } from '../../world/officeTextures'

/*
 * Muebles low-poly reutilizables. Todos miran hacia +Z local; se orientan con `rotationY`.
 */

type Placement = { position: Vec3; rotationY?: number }

/** Material Lambert con sombreado plano y temblor de vértices PS1. */
export function Flat({ color, map }: { color?: string; map?: THREE.Texture }) {
  return <meshLambertMaterial color={color} map={map} flatShading onBeforeCompile={ps1VertexSnap} />
}

export function Box({
  size,
  position,
  color,
  map,
  rotationY = 0,
}: {
  size: Vec3
  position: Vec3
  color?: string
  map?: THREE.Texture
  rotationY?: number
}) {
  return (
    <mesh position={position} rotation-y={rotationY}>
      <boxGeometry args={size} />
      <Flat color={color} map={map} />
    </mesh>
  )
}

function Placed({ position, rotationY = 0, children }: Placement & { children: ReactNode }) {
  return (
    <group position={position} rotation-y={rotationY}>
      {children}
    </group>
  )
}

export function Desk({
  width,
  depth,
  height = 0.76,
  ...placement
}: Placement & { width: number; depth: number; height?: number }) {
  const wood = useMemo(() => woodTexture(11), [])
  const legX = width / 2 - 0.05
  const legZ = depth / 2 - 0.05
  return (
    <Placed {...placement}>
      <Box size={[width, 0.05, depth]} position={[0, height - 0.025, 0]} map={wood} />
      {/* Faldón metálico al frente y patas */}
      <Box size={[width - 0.1, 0.3, 0.03]} position={[0, height - 0.2, -depth / 2 + 0.05]} color="#1c1d20" />
      {[
        [-legX, -legZ],
        [legX, -legZ],
        [-legX, legZ],
        [legX, legZ],
      ].map(([x = 0, z = 0]) => (
        <Box key={`${x}${z}`} size={[0.05, height - 0.05, 0.05]} position={[x, (height - 0.05) / 2, z]} color="#18191b" />
      ))}
    </Placed>
  )
}

export function OfficeChair(placement: Placement) {
  return (
    <Placed {...placement}>
      <Box size={[0.46, 0.08, 0.44]} position={[0, 0.48, 0]} color="#1b1c1f" />
      <Box size={[0.44, 0.5, 0.07]} position={[0, 0.78, -0.2]} color="#1b1c1f" />
      <Box size={[0.06, 0.4, 0.06]} position={[0, 0.25, 0]} color="#0f0f10" />
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 5]} />
        <Flat color="#0f0f10" />
      </mesh>
    </Placed>
  )
}

export function Sofa({ width = 2, color = '#1e1f23', ...placement }: Placement & { width?: number; color?: string }) {
  const fabric = useMemo(() => fabricTexture(color, 21), [color])
  return (
    <Placed {...placement}>
      <Box size={[width, 0.42, 0.85]} position={[0, 0.21, 0]} map={fabric} />
      <Box size={[width, 0.5, 0.2]} position={[0, 0.62, -0.33]} map={fabric} />
      <Box size={[0.18, 0.62, 0.85]} position={[-width / 2 + 0.09, 0.31, 0]} map={fabric} />
      <Box size={[0.18, 0.62, 0.85]} position={[width / 2 - 0.09, 0.31, 0]} map={fabric} />
    </Placed>
  )
}

export function Plant({ size = 1, ...placement }: Placement & { size?: number }) {
  return (
    <Placed {...placement}>
      <mesh position={[0, 0.2 * size, 0]}>
        <cylinderGeometry args={[0.2 * size, 0.15 * size, 0.4 * size, 6]} />
        <Flat color="#2a2b2f" />
      </mesh>
      {[0, 1.3, 2.6, 3.9, 5.2].map((angle, i) => (
        <mesh
          key={angle}
          position={[Math.sin(angle) * 0.12 * size, (0.75 + (i % 2) * 0.18) * size, Math.cos(angle) * 0.12 * size]}
          rotation={[Math.cos(angle) * 0.5, angle, Math.sin(angle) * 0.5]}
        >
          <coneGeometry args={[0.16 * size, 0.7 * size, 4]} />
          <Flat color={i % 2 ? '#2f4a2a' : '#264022'} />
        </mesh>
      ))}
    </Placed>
  )
}

/** Monitor CRT de los noventa: carcasa beige y pantalla emisiva. `screen` es la textura de la pantalla. */
export function Monitor({
  screen,
  width = 0.42,
  ...placement
}: Placement & { screen: THREE.Texture; width?: number }) {
  const material = useRef<THREE.MeshBasicMaterial>(null)
  const seed = useMemo(() => Math.random() * 10, [])
  useFrame(({ clock }) => {
    if (material.current) material.current.color.setScalar(0.86 + Math.sin(clock.elapsedTime * 7 + seed) * 0.05)
  })
  const height = width * 0.76
  const body = width + 0.1
  return (
    <Placed {...placement}>
      <Box size={[0.3, 0.04, 0.26]} position={[0, 0.02, -0.08]} color="#6d6858" />
      <Box size={[body, height + 0.1, body * 0.85]} position={[0, 0.06 + (height + 0.1) / 2, -0.12]} color="#8c8672" />
      <Box size={[body * 0.7, height * 0.8, 0.2]} position={[0, 0.06 + (height + 0.1) / 2, -0.12 - body * 0.5]} color="#7a7563" />
      <mesh position={[0, 0.06 + (height + 0.1) / 2, -0.12 + (body * 0.85) / 2 + 0.002]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial ref={material} map={screen} fog={false} />
      </mesh>
    </Placed>
  )
}

export function Keyboard(placement: Placement) {
  return (
    <Placed {...placement}>
      <Box size={[0.42, 0.02, 0.14]} position={[0, 0.01, 0]} color="#202124" />
    </Placed>
  )
}

/** Pantalla o cuadro colgado de la pared (mira hacia +Z local). */
export function WallScreen({
  texture,
  width,
  height,
  glow = true,
  ...placement
}: Placement & { texture: THREE.Texture; width: number; height: number; glow?: boolean }) {
  return (
    <Placed {...placement}>
      <Box size={[width + 0.08, height + 0.08, 0.05]} position={[0, 0, -0.02]} color="#0d0d0f" />
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width, height]} />
        {glow ? <meshBasicMaterial map={texture} fog={false} /> : <meshLambertMaterial map={texture} />}
      </mesh>
    </Placed>
  )
}

export function Shelf({ width, ...placement }: Placement & { width: number }) {
  const wood = useMemo(() => woodTexture(31, '#2e2117'), [])
  const binders = ['#5a2a24', '#23384f', '#2f4a2a', '#6b5a2a', '#3a3a3e']
  return (
    <Placed {...placement}>
      <Box size={[width, 1.9, 0.42]} position={[0, 0.95, 0]} map={wood} />
      {[0.45, 1.05, 1.6].map((y) => (
        <group key={y}>
          <Box size={[width - 0.08, 0.42, 0.04]} position={[0, y, 0.2]} color="#151210" />
          {binders.map((color, i) => (
            <Box
              key={color}
              size={[0.09, 0.32, 0.3]}
              position={[-width / 2 + 0.2 + i * 0.13 + (y > 1 ? 0.4 : 0), y - 0.03, 0.06]}
              color={color}
            />
          ))}
        </group>
      ))}
    </Placed>
  )
}

/** Plafón del techo: luz puntual con un panel emisivo y parpadeo ocasional. */
export function CeilingLight({
  position,
  color = '#ffe2b8',
  intensity = 6,
  distance = 10,
  flicker = false,
}: {
  position: Vec3
  color?: string
  intensity?: number
  distance?: number
  flicker?: boolean
}) {
  const light = useRef<THREE.PointLight>(null)
  const panel = useRef<THREE.MeshBasicMaterial>(null)
  const nextFlicker = useRef(3 + Math.random() * 5)
  const until = useRef(0)

  useFrame(({ clock }) => {
    if (!flicker) return
    const t = clock.elapsedTime
    if (t > nextFlicker.current) {
      until.current = t + 0.08 + Math.random() * 0.2
      nextFlicker.current = t + 4 + Math.random() * 8
    }
    const on = t > until.current || Math.sin(t * 90) > 0.3
    if (light.current) light.current.intensity = on ? intensity : intensity * 0.15
    if (panel.current) panel.current.color.setScalar(on ? 1 : 0.3)
  })

  return (
    <group position={position}>
      <mesh rotation-x={Math.PI / 2}>
        <planeGeometry args={[0.9, 0.35]} />
        <meshBasicMaterial ref={panel} color={color} fog={false} />
      </mesh>
      <pointLight ref={light} position={[0, -0.3, 0]} color={color} intensity={intensity} distance={distance} decay={1.4} />
    </group>
  )
}

/** Papeles, taza y un cable: detalles para que los escritorios no se vean vacíos. */
export function DeskClutter({ seed = 0, ...placement }: Placement & { seed?: number }) {
  const offset = (seed % 3) * 0.08
  return (
    <Placed {...placement}>
      <Box size={[0.22, 0.008, 0.3]} position={[-0.35 + offset, 0.004, 0.05]} rotationY={0.2 + seed} color="#d9d4c7" />
      <Box size={[0.22, 0.008, 0.3]} position={[-0.32 + offset, 0.012, 0.08]} rotationY={-0.1 + seed} color="#c9c2b0" />
      <mesh position={[0.4 - offset, 0.05, 0.12]}>
        <cylinderGeometry args={[0.04, 0.035, 0.1, 6]} />
        <Flat color={seed % 2 ? '#7a2a24' : '#2a3a5a'} />
      </mesh>
    </Placed>
  )
}

/** Cable en el piso, de un mueble a la pared. */
export function FloorCable({ from, to }: { from: [number, number]; to: [number, number] }) {
  const dx = to[0] - from[0]
  const dz = to[1] - from[1]
  const length = Math.hypot(dx, dz)
  return (
    <Box
      size={[0.025, 0.015, length]}
      position={[(from[0] + to[0]) / 2, 0.008, (from[1] + to[1]) / 2]}
      rotationY={Math.atan2(dx, dz)}
      color="#0c0c0d"
    />
  )
}

/** Archivero metálico de cajones con etiqueta. */
export function FilingCabinet({
  label,
  width = 0.9,
  depth = 0.6,
  height = 1.4,
  ...placement
}: Placement & { label: THREE.Texture; width?: number; depth?: number; height?: number }) {
  const drawers = 4
  const drawerHeight = (height - 0.08) / drawers
  return (
    <Placed {...placement}>
      <Box size={[width, height, depth]} position={[0, height / 2, 0]} color="#4a5058" />
      {Array.from({ length: drawers }, (_, i) => (
        <group key={i} position={[0, 0.06 + drawerHeight * (i + 0.5), depth / 2]}>
          <Box size={[width - 0.08, drawerHeight - 0.04, 0.02]} position={[0, 0, 0.005]} color="#58606a" />
          <Box size={[0.18, 0.025, 0.03]} position={[0, -drawerHeight * 0.2, 0.025]} color="#9a9c98" />
        </group>
      ))}
      <mesh position={[0, height - 0.18, depth / 2 + 0.03]}>
        <planeGeometry args={[width - 0.16, 0.16]} />
        <meshLambertMaterial map={label} />
      </mesh>
    </Placed>
  )
}

/** Gabinete de servidores con frente de LEDs. */
export function ServerRack({
  front,
  width = 0.66,
  depth = 1.0,
  height = 2.1,
  ...placement
}: Placement & { front: THREE.Texture; width?: number; depth?: number; height?: number }) {
  return (
    <Placed {...placement}>
      <Box size={[width, height, depth]} position={[0, height / 2, 0]} color="#16181c" />
      <mesh position={[0, height / 2, depth / 2 + 0.006]}>
        <planeGeometry args={[width - 0.08, height - 0.12]} />
        <meshBasicMaterial map={front} fog={false} />
      </mesh>
    </Placed>
  )
}
