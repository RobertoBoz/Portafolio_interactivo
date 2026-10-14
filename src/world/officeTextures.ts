import * as THREE from 'three'
import { createPaintedTexture, createTextTexture } from './textures'

/*
 * Texturas de la oficina de noche: piso de loseta, muros, lambrín de madera,
 * alfombra y pantallas. Todas diminutas y con filtrado nearest.
 */

function speckle(ctx: CanvasRenderingContext2D, random: () => number, size: number, amount: number, color: string) {
  ctx.fillStyle = color
  for (let i = 0; i < amount; i++) ctx.fillRect(Math.floor(random() * size), Math.floor(random() * size), 1, 1)
}

function withRepeat(texture: THREE.CanvasTexture, x: number, y: number): THREE.CanvasTexture {
  texture.repeat.set(x, y)
  return texture
}

/** Loseta oscura de 1 m: cada textura de 32 px cubre 2 × 2 losetas. */
export function tileTexture(width: number, depth: number, base = '#2c2e33', seed = 1): THREE.CanvasTexture {
  const texture = createPaintedTexture(32, seed, (ctx, random) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, 32, 32)
    speckle(ctx, random, 32, 140, '#34363c')
    speckle(ctx, random, 32, 90, '#232529')
    ctx.fillStyle = '#18191c'
    ctx.fillRect(0, 0, 32, 1)
    ctx.fillRect(0, 16, 32, 1)
    ctx.fillRect(0, 0, 1, 32)
    ctx.fillRect(16, 0, 1, 32)
  })
  return withRepeat(texture, width / 2, depth / 2)
}

export function wallTexture(length: number, height: number, base = '#3b4048', seed = 2): THREE.CanvasTexture {
  const texture = createPaintedTexture(32, seed, (ctx, random) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, 32, 32)
    speckle(ctx, random, 32, 120, '#424852')
    speckle(ctx, random, 32, 80, '#343941')
  })
  return withRepeat(texture, length / 2, height / 2)
}

export function woodTexture(seed = 3, base = '#3a2a1e'): THREE.CanvasTexture {
  return createPaintedTexture(32, seed, (ctx, random) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, 32, 32)
    for (let y = 0; y < 32; y++) {
      ctx.fillStyle = random() > 0.5 ? '#44321f' : '#2f2218'
      ctx.fillRect(0, y, 32, random() > 0.7 ? 1 : 0)
    }
    speckle(ctx, random, 32, 60, '#4a3726')
    ctx.fillStyle = '#21180f'
    ctx.fillRect(0, 0, 1, 32)
    ctx.fillRect(15, 0, 1, 32)
  })
}

export function rugTexture(seed = 4): THREE.CanvasTexture {
  return createPaintedTexture(32, seed, (ctx, random) => {
    ctx.fillStyle = '#26272b'
    ctx.fillRect(0, 0, 32, 32)
    ctx.strokeStyle = '#4a4740'
    ctx.strokeRect(2.5, 2.5, 27, 27)
    ctx.strokeStyle = '#33322f'
    ctx.strokeRect(5.5, 5.5, 21, 21)
    speckle(ctx, random, 32, 120, '#2e2f34')
  })
}

export function fabricTexture(base: string, seed = 5): THREE.CanvasTexture {
  return createPaintedTexture(16, seed, (ctx, random) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, 16, 16)
    speckle(ctx, random, 16, 40, '#00000030')
    speckle(ctx, random, 16, 20, '#ffffff12')
  })
}

/** Pantalla con líneas de "código" de colores. */
export function codeScreenTexture(title: string, seed: number, accent = '#7fd1ff'): THREE.CanvasTexture {
  return createPaintedTexture(48, seed, (ctx, random) => {
    ctx.fillStyle = '#0a1520'
    ctx.fillRect(0, 0, 48, 48)
    ctx.fillStyle = accent
    ctx.font = '7px monospace'
    ctx.textBaseline = 'top'
    ctx.fillText(title.slice(0, 9), 2, 2)
    const colors = ['#5fa8d3', '#c792ea', '#9ece6a', '#e0af68', '#6b7a8f']
    for (let y = 12; y < 46; y += 3) {
      const indent = Math.floor(random() * 4) * 3
      ctx.fillStyle = colors[Math.floor(random() * colors.length)] ?? '#5fa8d3'
      ctx.fillRect(3 + indent, y, 6 + Math.floor(random() * 26), 1)
    }
  })
}

/** Pantalla de panel con gráficas, para las televisiones de pared. */
export function dashboardTexture(seed: number): THREE.CanvasTexture {
  return createPaintedTexture(48, seed, (ctx, random) => {
    ctx.fillStyle = '#071019'
    ctx.fillRect(0, 0, 48, 48)
    ctx.fillStyle = '#1d4e7a'
    ctx.fillRect(2, 2, 44, 6)
    for (let i = 0; i < 9; i++) {
      const h = 6 + Math.floor(random() * 18)
      ctx.fillStyle = i % 3 === 0 ? '#5fd3a8' : '#3a8fd1'
      ctx.fillRect(3 + i * 5, 40 - h, 3, h)
    }
    ctx.fillStyle = '#e0af68'
    ctx.fillRect(2, 43, 20 + Math.floor(random() * 20), 2)
  })
}

export function signTexture(lines: string[], color = '#d9d4c7', background = '#141518'): THREE.CanvasTexture {
  return createTextTexture(lines, { width: 96, height: 24, color, background, fontSize: 9 })
}

/** Pared de mensaje grande del lobby. */
export function mottoTexture(): THREE.CanvasTexture {
  return createPaintedTexture(128, 7, (ctx) => {
    ctx.fillStyle = '#0d0e10'
    ctx.fillRect(0, 0, 128, 128)
    ctx.fillStyle = '#6d6f75'
    ctx.font = '22px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Build', 64, 34)
    ctx.fillText('Ship', 64, 64)
    ctx.fillText('Improve', 64, 94)
  })
}
