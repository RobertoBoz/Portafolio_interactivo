import { useMemo } from 'react'
import { BOXES, CABINET, DESK, ROOM } from '../world/layout'
import { createNoiseTexture } from '../world/textures'
import { ps1VertexSnap } from '../world/ps1Material'

const WIDTH = ROOM.maxX - ROOM.minX
const DEPTH = ROOM.maxZ - ROOM.minZ
const CENTER_X = (ROOM.maxX + ROOM.minX) / 2
const CENTER_Z = (ROOM.maxZ + ROOM.minZ) / 2

/** Cuarto abandonado: piso de concreto, cuatro paredes, techo y mobiliario básico. */
export function Room() {
  const textures = useMemo(
    () => ({
      floor: createNoiseTexture({ base: '#4a4842', grain: 40, stains: 10, repeat: [WIDTH / 2, DEPTH / 2], seed: 11 }),
      wallLong: createNoiseTexture({ base: '#5a5f55', grain: 22, stains: 6, repeat: [WIDTH / 2, ROOM.height / 2], seed: 23 }),
      wallShort: createNoiseTexture({ base: '#5a5f55', grain: 22, stains: 6, repeat: [DEPTH / 2, ROOM.height / 2], seed: 29 }),
      ceiling: createNoiseTexture({ base: '#3a3b37', grain: 18, repeat: [WIDTH / 2, DEPTH / 2], seed: 31 }),
      wood: createNoiseTexture({ base: '#5b4632', grain: 26, stains: 3, seed: 41 }),
      metal: createNoiseTexture({ base: '#4d5257', grain: 20, stains: 4, seed: 53 }),
      cardboard: createNoiseTexture({ base: '#6e5a3e', grain: 24, stains: 2, seed: 67 }),
    }),
    [],
  )

  const halfH = ROOM.height / 2

  return (
    <group>
      {/* Piso */}
      <mesh rotation-x={-Math.PI / 2} position={[CENTER_X, 0, CENTER_Z]}>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshLambertMaterial map={textures.floor} onBeforeCompile={ps1VertexSnap} />
      </mesh>

      {/* Techo */}
      <mesh rotation-x={Math.PI / 2} position={[CENTER_X, ROOM.height, CENTER_Z]}>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshLambertMaterial map={textures.ceiling} onBeforeCompile={ps1VertexSnap} />
      </mesh>

      {/* Paredes: cada plano mira hacia el interior del cuarto */}
      <mesh position={[CENTER_X, halfH, ROOM.minZ]}>
        <planeGeometry args={[WIDTH, ROOM.height]} />
        <meshLambertMaterial map={textures.wallLong} onBeforeCompile={ps1VertexSnap} />
      </mesh>
      <mesh position={[CENTER_X, halfH, ROOM.maxZ]} rotation-y={Math.PI}>
        <planeGeometry args={[WIDTH, ROOM.height]} />
        <meshLambertMaterial map={textures.wallLong} onBeforeCompile={ps1VertexSnap} />
      </mesh>
      <mesh position={[ROOM.minX, halfH, CENTER_Z]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[DEPTH, ROOM.height]} />
        <meshLambertMaterial map={textures.wallShort} onBeforeCompile={ps1VertexSnap} />
      </mesh>
      <mesh position={[ROOM.maxX, halfH, CENTER_Z]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[DEPTH, ROOM.height]} />
        <meshLambertMaterial map={textures.wallShort} onBeforeCompile={ps1VertexSnap} />
      </mesh>

      <Baseboards />

      {/* Mesa */}
      <group position={DESK.position}>
        <mesh position={[0, DESK.height - 0.03, 0]}>
          <boxGeometry args={[DESK.width, 0.06, DESK.depth]} />
          <meshLambertMaterial map={textures.wood} onBeforeCompile={ps1VertexSnap} />
        </mesh>
        {[
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ].map(([sx = 0, sz = 0]) => (
          <mesh
            key={`${sx}${sz}`}
            position={[(sx * (DESK.width - 0.12)) / 2, (DESK.height - 0.06) / 2, (sz * (DESK.depth - 0.12)) / 2]}
          >
            <boxGeometry args={[0.06, DESK.height - 0.06, 0.06]} />
            <meshLambertMaterial color="#2c2620" />
          </mesh>
        ))}
      </group>

      {/* Archivero metálico */}
      <group position={CABINET.position}>
        <mesh position={[0, CABINET.height / 2, 0]}>
          <boxGeometry args={[CABINET.width, CABINET.height, CABINET.depth]} />
          <meshLambertMaterial map={textures.metal} onBeforeCompile={ps1VertexSnap} />
        </mesh>
        {[0.3, 0.72, 1.12].map((y) => (
          <mesh key={y} position={[0, y, CABINET.depth / 2 + 0.01]}>
            <boxGeometry args={[0.22, 0.04, 0.02]} />
            <meshLambertMaterial color="#8a8f94" />
          </mesh>
        ))}
      </group>

      {/* Cajas de cartón apiladas */}
      <group position={BOXES.position}>
        <mesh position={[0, 0.25, 0]} rotation-y={0.2}>
          <boxGeometry args={[0.7, 0.5, 0.55]} />
          <meshLambertMaterial map={textures.cardboard} onBeforeCompile={ps1VertexSnap} />
        </mesh>
        <mesh position={[0.35, 0.2, 0.25]} rotation-y={-0.35}>
          <boxGeometry args={[0.45, 0.4, 0.45]} />
          <meshLambertMaterial map={textures.cardboard} onBeforeCompile={ps1VertexSnap} />
        </mesh>
        <mesh position={[0.05, 0.68, -0.02]} rotation-y={0.55}>
          <boxGeometry args={[0.5, 0.36, 0.42]} />
          <meshLambertMaterial map={textures.cardboard} onBeforeCompile={ps1VertexSnap} />
        </mesh>
      </group>
    </group>
  )
}

function Baseboards() {
  const color = '#2a2c28'
  const h = 0.12
  return (
    <group>
      <mesh position={[CENTER_X, h / 2, ROOM.minZ + 0.02]}>
        <boxGeometry args={[WIDTH, h, 0.04]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[CENTER_X, h / 2, ROOM.maxZ - 0.02]}>
        <boxGeometry args={[WIDTH, h, 0.04]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[ROOM.minX + 0.02, h / 2, CENTER_Z]}>
        <boxGeometry args={[0.04, h, DEPTH]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[ROOM.maxX - 0.02, h / 2, CENTER_Z]}>
        <boxGeometry args={[0.04, h, DEPTH]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  )
}
