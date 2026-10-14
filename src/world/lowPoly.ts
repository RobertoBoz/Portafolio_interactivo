import * as THREE from 'three'
import { createPaintedTexture } from './textures'

/*
 * Geometrías y texturas del personaje al estilo de los modelos de PS1:
 * prismas de pocas caras, sombreado plano y texturas pequeñas pintadas.
 * Todas las piezas miran hacia +Z (el frente del personaje).
 */

/** Prisma cónico con el pivote en su extremo superior (hombro, cadera, codo). */
export function limbGeometry(
  topRadius: number,
  bottomRadius: number,
  length: number,
  sides = 6,
  depthScale = 1,
): THREE.BufferGeometry {
  // thetaStart = PI deja la costura de la textura en la espalda y el centro del mapa al frente.
  const geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, length, sides, 1, false, Math.PI)
  geometry.translate(0, -length / 2, 0)
  geometry.scale(1, 1, depthScale)
  return geometry
}

/** Torso hexagonal: hombros anchos, pecho ligeramente abultado y cintura más estrecha. */
export function torsoGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.22, 0.175, 0.66, 6, 2, false, Math.PI)
  const position = geometry.getAttribute('position')
  for (let i = 0; i < position.count; i++) {
    if (Math.abs(position.getY(i)) < 1e-4) {
      position.setX(i, position.getX(i) * 1.05)
      position.setZ(i, position.getZ(i) * 1.12)
    }
  }
  geometry.scale(1, 1, 0.58)
  geometry.computeVertexNormals()
  return geometry
}

/**
 * Cabeza facetada: esfera de pocos segmentos con mandíbula más estrecha.
 * Las coordenadas UV se proyectan de frente para pintar la cara en una textura plana.
 */
export function headGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(0.13, 8, 6)
  geometry.scale(0.88, 1.1, 0.96)
  const position = geometry.getAttribute('position')
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i)
    if (y < -0.04) {
      // Mandíbula y barbilla en punta.
      position.setX(i, position.getX(i) * 0.82)
      position.setZ(i, position.getZ(i) * 0.95 + 0.012)
    }
  }
  projectFrontUv(geometry)
  geometry.computeVertexNormals()
  return geometry
}

/** Nariz: pirámide de tres caras que sobresale de la cara. */
export function noseGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.ConeGeometry(0.022, 0.055, 3)
  geometry.rotateY(Math.PI)
  return geometry
}

/**
 * Melena: cascarón abierto alrededor de la nuca y los lados, con el frente
 * descubierto y el borde inferior irregular como mechones.
 */
export function hairGeometry(): THREE.BufferGeometry {
  const gap = 0.8
  const geometry = new THREE.CylinderGeometry(0.15, 0.19, 0.46, 9, 2, true, gap, Math.PI * 2 - gap * 2)
  const position = geometry.getAttribute('position')
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i)
    if (Math.abs(y) < 1e-4) {
      position.setX(i, position.getX(i) * 1.08)
      position.setZ(i, position.getZ(i) * 1.08)
    } else if (y < 0) {
      // Puntas desiguales.
      position.setY(i, y - ((i * 37) % 5) * 0.018)
    }
  }
  geometry.computeVertexNormals()
  return geometry
}

/** Casquete del cabello sobre la cabeza (queda casi oculto por el sombrero). */
export function hairCapGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(0.148, 8, 3, 0, Math.PI * 2, 0, Math.PI / 2)
  geometry.scale(0.95, 0.8, 1)
  return geometry
}

export function hatBrimGeometry(): THREE.BufferGeometry {
  return new THREE.CylinderGeometry(0.25, 0.26, 0.024, 10)
}

/** Copa del sombrero con la parte superior hundida, como un fedora. */
export function hatCrownGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.118, 0.152, 0.16, 7, 1)
  const position = geometry.getAttribute('position')
  for (let i = 0; i < position.count; i++) {
    if (position.getY(i) > 0.07 && Math.abs(position.getX(i)) < 0.05 && Math.abs(position.getZ(i)) < 0.05) {
      position.setY(i, position.getY(i) - 0.035)
    }
  }
  geometry.computeVertexNormals()
  return geometry
}

function projectFrontUv(geometry: THREE.BufferGeometry): void {
  geometry.computeBoundingBox()
  const box = geometry.boundingBox
  if (!box) return
  const position = geometry.getAttribute('position')
  const uv = new Float32Array(position.count * 2)
  for (let i = 0; i < position.count; i++) {
    uv[i * 2] = (position.getX(i) - box.min.x) / (box.max.x - box.min.x)
    uv[i * 2 + 1] = (position.getY(i) - box.min.y) / (box.max.y - box.min.y)
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
}

/* ---------------------------------- Texturas --------------------------------- */

const SKIN = '#c69a7c'

function speckle(ctx: CanvasRenderingContext2D, random: () => number, size: number, amount: number, color: string) {
  ctx.fillStyle = color
  for (let i = 0; i < amount; i++) {
    ctx.fillRect(Math.floor(random() * size), Math.floor(random() * size), 1, 1)
  }
}

/** Cara pintada: cejas, ojos, lentes de armazón delgado, sombra de nariz y boca. */
export function createFaceTexture(): THREE.CanvasTexture {
  return createPaintedTexture(32, 101, (ctx, random) => {
    ctx.fillStyle = SKIN
    ctx.fillRect(0, 0, 32, 32)
    speckle(ctx, random, 32, 70, '#b88b6e')
    // Sombra de pómulos y mandíbula
    ctx.fillStyle = '#a97d62'
    ctx.fillRect(4, 18, 3, 7)
    ctx.fillRect(25, 18, 3, 7)
    ctx.fillRect(9, 27, 14, 2)
    // Cejas
    ctx.fillStyle = '#1e1511'
    ctx.fillRect(8, 11, 6, 1)
    ctx.fillRect(18, 11, 6, 1)
    // Ojos
    ctx.fillStyle = '#f0e6da'
    ctx.fillRect(9, 14, 4, 2)
    ctx.fillRect(19, 14, 4, 2)
    ctx.fillStyle = '#2a1a12'
    ctx.fillRect(10, 14, 2, 2)
    ctx.fillRect(20, 14, 2, 2)
    // Armazón de los lentes
    ctx.fillStyle = '#0d0d0d'
    ctx.strokeStyle = '#0d0d0d'
    ctx.lineWidth = 1
    ctx.strokeRect(7.5, 12.5, 7, 5)
    ctx.strokeRect(17.5, 12.5, 7, 5)
    ctx.fillRect(15, 13, 2, 1)
    ctx.fillRect(4, 13, 3, 1)
    ctx.fillRect(25, 13, 3, 1)
    // Nariz
    ctx.fillStyle = '#a97d62'
    ctx.fillRect(15, 17, 2, 4)
    ctx.fillRect(14, 21, 4, 1)
    // Boca
    ctx.fillStyle = '#7f5546'
    ctx.fillRect(12, 24, 8, 1)
    ctx.fillStyle = '#9b6a58'
    ctx.fillRect(13, 25, 6, 1)
  })
}

/** Camisa negra con pliegues y una fila de botones al centro. */
export function createShirtTexture(): THREE.CanvasTexture {
  return createPaintedTexture(32, 202, (ctx, random) => {
    ctx.fillStyle = '#202127'
    ctx.fillRect(0, 0, 32, 32)
    speckle(ctx, random, 32, 120, '#2a2b33')
    speckle(ctx, random, 32, 90, '#16171b')
    // Pliegues diagonales
    ctx.fillStyle = '#141519'
    for (let i = 0; i < 6; i++) {
      const x = Math.floor(random() * 28)
      const y = Math.floor(random() * 26)
      ctx.fillRect(x, y, 1, 4)
      ctx.fillRect(x + 1, y + 3, 1, 3)
    }
    // Botonadura al frente (centro de la textura)
    ctx.fillStyle = '#121216'
    ctx.fillRect(15, 0, 2, 32)
    ctx.fillStyle = '#5c5e66'
    for (let y = 3; y < 32; y += 7) ctx.fillRect(16, y, 1, 1)
  })
}

/** Pantalón gris con pliegues verticales. */
export function createPantsTexture(): THREE.CanvasTexture {
  return createPaintedTexture(16, 303, (ctx, random) => {
    ctx.fillStyle = '#5a5c62'
    ctx.fillRect(0, 0, 16, 16)
    speckle(ctx, random, 16, 40, '#4c4e54')
    speckle(ctx, random, 16, 25, '#67696f')
    ctx.fillStyle = '#45474c'
    ctx.fillRect(7, 0, 1, 16)
    ctx.fillRect(3, 9, 1, 5)
    ctx.fillRect(12, 4, 1, 6)
  })
}

/** Cabello oscuro con mechones. */
export function createHairTexture(): THREE.CanvasTexture {
  return createPaintedTexture(16, 404, (ctx, random) => {
    ctx.fillStyle = '#1c1512'
    ctx.fillRect(0, 0, 16, 16)
    for (let x = 0; x < 16; x++) {
      ctx.fillStyle = random() > 0.5 ? '#2a201b' : '#120d0b'
      const start = Math.floor(random() * 6)
      ctx.fillRect(x, start, 1, 6 + Math.floor(random() * 10))
    }
  })
}

/** Piel lisa con algo de ruido, para brazos y manos. */
export function createSkinTexture(): THREE.CanvasTexture {
  return createPaintedTexture(8, 505, (ctx, random) => {
    ctx.fillStyle = SKIN
    ctx.fillRect(0, 0, 8, 8)
    speckle(ctx, random, 8, 10, '#b88b6e')
  })
}
