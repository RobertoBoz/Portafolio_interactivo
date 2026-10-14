import * as THREE from 'three'

type NoiseOptions = {
  size?: number
  base: string
  /** Variación máxima de brillo por píxel (0–255). */
  grain: number
  /** Número de manchas oscuras. */
  stains?: number
  repeat?: [number, number]
  seed: number
}

/** Generador pseudoaleatorio determinista para que las texturas no cambien entre recargas. */
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function toPixelTexture(canvas: HTMLCanvasElement, repeat: [number, number]): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.generateMipmaps = false
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeat[0], repeat[1])
  return texture
}

/** Textura pequeña de ruido (32 px por defecto) con filtrado nearest-neighbor. */
export function createNoiseTexture({
  size = 32,
  base,
  grain,
  stains = 0,
  repeat = [1, 1],
  seed,
}: NoiseOptions): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo crear el contexto 2D para la textura')

  const random = mulberry32(seed)
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)

  const image = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < image.data.length; i += 4) {
    const offset = (random() - 0.5) * grain
    image.data[i] = clampByte((image.data[i] ?? 0) + offset)
    image.data[i + 1] = clampByte((image.data[i + 1] ?? 0) + offset)
    image.data[i + 2] = clampByte((image.data[i + 2] ?? 0) + offset)
  }
  ctx.putImageData(image, 0, 0)

  for (let s = 0; s < stains; s++) {
    ctx.fillStyle = `rgba(0, 0, 0, ${0.12 + random() * 0.18})`
    const w = 2 + Math.floor(random() * 6)
    const h = 2 + Math.floor(random() * 8)
    ctx.fillRect(Math.floor(random() * size), Math.floor(random() * size), w, h)
  }

  return toPixelTexture(canvas, repeat)
}

/** Textura de baja resolución con texto, para pantallas y letreros. */
export function createTextTexture(
  lines: string[],
  options: { width: number; height: number; color: string; background: string; fontSize: number },
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo crear el contexto 2D para la textura')

  ctx.fillStyle = options.background
  ctx.fillRect(0, 0, options.width, options.height)
  ctx.fillStyle = options.color
  ctx.font = `${options.fontSize}px monospace`
  ctx.textBaseline = 'top'
  lines.forEach((line, index) => {
    ctx.fillText(line, 3, 3 + index * (options.fontSize + 2))
  })

  return toPixelTexture(canvas, [1, 1])
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}
