import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { CHARACTER } from '../world/layout'
import { resolveMove } from '../world/collision'
import { findNearbyInteraction } from '../world/interactions'
import type { Control } from '../world/controls'
import { useGameStore } from '../store/gameStore'
import { ps1VertexSnap } from '../world/ps1Material'

/** Qué tan rápido alcanza la velocidad objetivo; bajo = movimiento pesado. */
const ACCELERATION = 5

/**
 * Personaje low-poly con controles tipo tanque:
 * W/S avanzan y retroceden en la dirección a la que mira, A/D lo giran.
 */
export function Character() {
  const root = useRef<THREE.Group>(null)
  const leftLeg = useRef<THREE.Group>(null)
  const rightLeg = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)

  const position = useRef({ x: CHARACTER.start[0], z: CHARACTER.start[2] })
  const heading = useRef<number>(CHARACTER.startHeading)
  const speed = useRef(0)
  const walkPhase = useRef(0)

  const [, getKeys] = useKeyboardControls<Control>()

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const { isInteracting, nearbyInteraction, setNearbyInteraction } = useGameStore.getState()
    const keys = getKeys()

    let turn = 0
    let move = 0
    if (!isInteracting) {
      turn = Number(keys.left) - Number(keys.right)
      move = Number(keys.forward) - Number(keys.backward)
    }

    heading.current += turn * CHARACTER.turnSpeed * delta
    const targetSpeed = move > 0 ? CHARACTER.walkSpeed : move < 0 ? -CHARACTER.backSpeed : 0
    speed.current = THREE.MathUtils.damp(speed.current, targetSpeed, ACCELERATION, delta)
    if (Math.abs(speed.current) < 0.01) speed.current = 0

    const step = speed.current * delta
    const next = resolveMove(
      position.current,
      {
        x: position.current.x + Math.sin(heading.current) * step,
        z: position.current.z + Math.cos(heading.current) * step,
      },
      CHARACTER.radius,
    )
    position.current = next

    if (root.current) {
      root.current.position.set(next.x, 0, next.z)
      root.current.rotation.y = heading.current
    }

    animateLimbs(delta)

    const nearby = findNearbyInteraction(position.current, heading.current)
    if (nearby !== nearbyInteraction) setNearbyInteraction(nearby)
  })

  /** Animación limitada: piernas y brazos oscilan según la velocidad, como en PS1. */
  function animateLimbs(delta: number) {
    const amount = Math.min(Math.abs(speed.current) / CHARACTER.walkSpeed, 1)
    walkPhase.current += delta * 7 * amount * Math.sign(speed.current || 1)
    // Cuantizar el ángulo da un movimiento "a saltos", con pocos fotogramas.
    const swing = Math.round(Math.sin(walkPhase.current) * 4) / 4
    const angle = swing * 0.55 * amount
    if (leftLeg.current) leftLeg.current.rotation.x = angle
    if (rightLeg.current) rightLeg.current.rotation.x = -angle
    if (leftArm.current) leftArm.current.rotation.x = -angle * 0.8
    if (rightArm.current) rightArm.current.rotation.x = angle * 0.8
  }

  return (
    <group ref={root} position={CHARACTER.start} rotation-y={CHARACTER.startHeading}>
      {/* Sombra simple bajo los pies */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.36, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} depthWrite={false} />
      </mesh>

      {/* Piernas: pantalón gris y zapatos negros (pivote en la cadera) */}
      <group ref={leftLeg} position={[0.1, 0.86, 0]}>
        <Part size={[0.15, 0.8, 0.16]} offset={[0, -0.4, 0]} color={COLORS.pants} />
        <Part size={[0.15, 0.08, 0.26]} offset={[0, -0.82, 0.05]} color={COLORS.shoes} />
      </group>
      <group ref={rightLeg} position={[-0.1, 0.86, 0]}>
        <Part size={[0.15, 0.8, 0.16]} offset={[0, -0.4, 0]} color={COLORS.pants} />
        <Part size={[0.15, 0.08, 0.26]} offset={[0, -0.82, 0.05]} color={COLORS.shoes} />
      </group>

      {/* Camisa negra por fuera del pantalón */}
      <Part size={[0.42, 0.66, 0.23]} offset={[0, 1.13, 0]} color={COLORS.shirt} />
      <Part size={[0.44, 0.06, 0.25]} offset={[0, 0.82, 0]} color={COLORS.shirt} />
      {/* Cuello y botonadura */}
      <Part size={[0.2, 0.06, 0.2]} offset={[0, 1.47, 0.01]} color={COLORS.shirt} />
      <Part size={[0.02, 0.6, 0.01]} offset={[0, 1.13, 0.12]} color={COLORS.shirtSeam} />

      {/* Brazos: manga arremangada al codo y antebrazo descubierto (pivote en el hombro) */}
      <group ref={leftArm} position={[0.28, 1.42, 0]}>
        <Part size={[0.13, 0.3, 0.14]} offset={[0, -0.15, 0]} color={COLORS.shirt} />
        <Part size={[0.14, 0.05, 0.15]} offset={[0, -0.3, 0]} color={COLORS.shirtSeam} />
        <Part size={[0.09, 0.26, 0.1]} offset={[0, -0.45, 0]} color={COLORS.skin} />
        <Part size={[0.08, 0.1, 0.09]} offset={[0, -0.62, 0.01]} color={COLORS.skin} />
      </group>
      <group ref={rightArm} position={[-0.28, 1.42, 0]}>
        <Part size={[0.13, 0.3, 0.14]} offset={[0, -0.15, 0]} color={COLORS.shirt} />
        <Part size={[0.14, 0.05, 0.15]} offset={[0, -0.3, 0]} color={COLORS.shirtSeam} />
        <Part size={[0.09, 0.26, 0.1]} offset={[0, -0.45, 0]} color={COLORS.skin} />
        <Part size={[0.08, 0.1, 0.09]} offset={[0, -0.62, 0.01]} color={COLORS.skin} />
      </group>

      {/* Cuello y cabeza */}
      <Part size={[0.1, 0.08, 0.1]} offset={[0, 1.52, 0]} color={COLORS.skin} />
      <Part size={[0.23, 0.27, 0.24]} offset={[0, 1.68, 0.01]} color={COLORS.skin} />

      {/* Cabello largo hasta los hombros */}
      <Part size={[0.3, 0.44, 0.08]} offset={[0, 1.6, -0.12]} color={COLORS.hair} />
      <Part size={[0.06, 0.44, 0.22]} offset={[0.145, 1.6, -0.01]} color={COLORS.hair} />
      <Part size={[0.06, 0.44, 0.22]} offset={[-0.145, 1.6, -0.01]} color={COLORS.hair} />
      <Part size={[0.26, 0.05, 0.26]} offset={[0, 1.83, 0]} color={COLORS.hair} />
      <Part size={[0.08, 0.06, 0.03]} offset={[0.08, 1.77, 0.13]} color={COLORS.hair} />

      {/* Ojos */}
      <Part size={[0.035, 0.022, 0.01]} offset={[0.055, 1.7, 0.131]} color={COLORS.eyes} />
      <Part size={[0.035, 0.022, 0.01]} offset={[-0.055, 1.7, 0.131]} color={COLORS.eyes} />

      {/* Lentes: armazón delgado */}
      {[0.055, -0.055].map((x) => (
        <group key={x} position={[x, 1.7, 0.138]}>
          <Part size={[0.085, 0.014, 0.012]} offset={[0, 0.028, 0]} color={COLORS.glasses} />
          <Part size={[0.085, 0.014, 0.012]} offset={[0, -0.028, 0]} color={COLORS.glasses} />
          <Part size={[0.014, 0.07, 0.012]} offset={[Math.sign(x) * 0.036, 0, 0]} color={COLORS.glasses} />
          <Part size={[0.014, 0.07, 0.012]} offset={[-Math.sign(x) * 0.036, 0, 0]} color={COLORS.glasses} />
        </group>
      ))}

      {/* Sombrero tipo fedora */}
      <mesh position={[0, 1.86, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.025, 10]} />
        <meshLambertMaterial color={COLORS.hat} onBeforeCompile={ps1VertexSnap} />
      </mesh>
      <mesh position={[0, 1.94, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.15, 8]} />
        <meshLambertMaterial color={COLORS.hat} onBeforeCompile={ps1VertexSnap} />
      </mesh>
      <mesh position={[0, 1.895, 0]}>
        <cylinderGeometry args={[0.152, 0.152, 0.04, 8]} />
        <meshLambertMaterial color={COLORS.hatBand} onBeforeCompile={ps1VertexSnap} />
      </mesh>
    </group>
  )
}

const COLORS = {
  skin: '#c69a7c',
  hair: '#1c1512',
  hat: '#1d1e22',
  hatBand: '#0b0b0c',
  glasses: '#0a0a0a',
  eyes: '#2a1a14',
  shirt: '#1f2025',
  shirtSeam: '#2c2d33',
  pants: '#5a5c61',
  shoes: '#121212',
} as const

type PartProps = {
  size: [number, number, number]
  offset: [number, number, number]
  color: string
}

function Part({ size, offset, color }: PartProps) {
  return (
    <mesh position={offset}>
      <boxGeometry args={size} />
      <meshLambertMaterial color={color} onBeforeCompile={ps1VertexSnap} />
    </mesh>
  )
}
