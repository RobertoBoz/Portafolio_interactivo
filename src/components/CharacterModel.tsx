import { useMemo, type RefObject } from 'react'
import * as THREE from 'three'
import { ps1VertexSnap } from '../world/ps1Material'
import {
  createFaceTexture,
  createHairTexture,
  createPantsTexture,
  createShirtTexture,
  createSkinTexture,
  hairCapGeometry,
  hairGeometry,
  hatBrimGeometry,
  hatCrownGeometry,
  headGeometry,
  limbGeometry,
  noseGeometry,
  torsoGeometry,
} from '../world/lowPoly'

export type LimbRefs = {
  leftLeg: RefObject<THREE.Group | null>
  rightLeg: RefObject<THREE.Group | null>
  leftArm: RefObject<THREE.Group | null>
  rightArm: RefObject<THREE.Group | null>
}

const COLORS = {
  hat: '#1d1e22',
  hatBand: '#0c0c0e',
  shoes: '#121212',
  collar: '#17181c',
} as const

/**
 * Modelo low-poly del personaje: sombrero fedora, cabello largo, lentes,
 * camisa negra arremangada y pantalón gris. Sombreado plano y texturas
 * pintadas a baja resolución, como los modelos de PS1.
 */
export function CharacterModel({ limbs }: { limbs: LimbRefs }) {
  const assets = useMemo(() => {
    const flat = (options: THREE.MeshLambertMaterialParameters) => {
      const material = new THREE.MeshLambertMaterial({ flatShading: true, ...options })
      material.onBeforeCompile = ps1VertexSnap
      return material
    }
    return {
      geometry: {
        torso: torsoGeometry(),
        hem: limbGeometry(0.19, 0.2, 0.08, 6, 0.6),
        thigh: limbGeometry(0.085, 0.07, 0.44, 6),
        shin: limbGeometry(0.07, 0.06, 0.4, 6),
        upperArm: limbGeometry(0.07, 0.062, 0.3, 6),
        cuff: limbGeometry(0.068, 0.068, 0.05, 6),
        forearm: limbGeometry(0.046, 0.038, 0.26, 5),
        hand: new THREE.BoxGeometry(0.06, 0.1, 0.085),
        shoe: new THREE.BoxGeometry(0.12, 0.08, 0.26),
        neck: limbGeometry(0.05, 0.055, 0.1, 5),
        collar: limbGeometry(0.075, 0.085, 0.06, 6),
        head: headGeometry(),
        nose: noseGeometry(),
        hair: hairGeometry(),
        hairCap: hairCapGeometry(),
        brim: hatBrimGeometry(),
        crown: hatCrownGeometry(),
        band: new THREE.CylinderGeometry(0.153, 0.153, 0.035, 7),
      },
      material: {
        face: flat({ map: createFaceTexture() }),
        skin: flat({ map: createSkinTexture() }),
        shirt: flat({ map: createShirtTexture() }),
        pants: flat({ map: createPantsTexture() }),
        hair: flat({ map: createHairTexture(), side: THREE.DoubleSide }),
        hat: flat({ color: COLORS.hat }),
        band: flat({ color: COLORS.hatBand }),
        shoes: flat({ color: COLORS.shoes }),
        collar: flat({ color: COLORS.collar }),
      },
    }
  }, [])

  const { geometry: g, material: m } = assets

  return (
    <group>
      {/* Piernas (pivote en la cadera) */}
      {([
        [limbs.leftLeg, 0.1],
        [limbs.rightLeg, -0.1],
      ] as const).map(([ref, x]) => (
        <group key={x} ref={ref} position={[x, 0.86, 0]}>
          <mesh geometry={g.thigh} material={m.pants} />
          <group position={[0, -0.42, 0]}>
            <mesh geometry={g.shin} material={m.pants} />
            <mesh geometry={g.shoe} material={m.shoes} position={[0, -0.4, 0.05]} />
          </group>
        </group>
      ))}

      {/* Camisa por fuera del pantalón */}
      <mesh geometry={g.torso} material={m.shirt} position={[0, 1.15, 0]} />
      <mesh geometry={g.hem} material={m.shirt} position={[0, 0.86, 0]} />
      <mesh geometry={g.collar} material={m.collar} position={[0, 1.52, 0]} />

      {/* Brazos: manga arremangada y antebrazo descubierto (pivote en el hombro) */}
      {([
        [limbs.leftArm, 0.27],
        [limbs.rightArm, -0.27],
      ] as const).map(([ref, x]) => (
        <group key={x} ref={ref} position={[x, 1.44, 0]}>
          <mesh geometry={g.upperArm} material={m.shirt} />
          <mesh geometry={g.cuff} material={m.collar} position={[0, -0.27, 0]} />
          <group position={[0, -0.3, 0]}>
            <mesh geometry={g.forearm} material={m.skin} />
            <mesh geometry={g.hand} material={m.skin} position={[0, -0.3, 0.01]} />
          </group>
        </group>
      ))}

      {/* Cuello y cabeza */}
      <mesh geometry={g.neck} material={m.skin} position={[0, 1.6, 0]} />
      <group position={[0, 1.69, 0.01]}>
        <mesh geometry={g.head} material={m.face} />
        <mesh geometry={g.nose} material={m.skin} position={[0, -0.01, 0.125]} rotation-x={Math.PI / 2} />
      </group>

      {/* Cabello largo hasta los hombros */}
      <mesh geometry={g.hair} material={m.hair} position={[0, 1.62, -0.005]} />
      <mesh geometry={g.hairCap} material={m.hair} position={[0, 1.75, 0]} />

      {/* Sombrero tipo fedora */}
      <mesh geometry={g.brim} material={m.hat} position={[0, 1.865, 0]} />
      <mesh geometry={g.crown} material={m.hat} position={[0, 1.95, 0]} />
      <mesh geometry={g.band} material={m.band} position={[0, 1.895, 0]} />
    </group>
  )
}
