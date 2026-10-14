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
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#c9b27a'
    ctx.font = '11px monospace'
    ctx.fillText('ROBERTO BOLAÑOS', 64, 14)
    ctx.fillStyle = '#7d8088'
    ctx.font = '8px monospace'
    ctx.fillText('DEVELOPER LOG', 64, 26)
    ctx.fillStyle = '#c9b27a'
    ctx.fillRect(34, 33, 60, 1)
    ctx.fillStyle = '#6d6f75'
    ctx.font = '20px monospace'
    ctx.fillText('Build', 64, 54)
    ctx.fillText('Ship', 64, 80)
    ctx.fillText('Improve', 64, 106)
  })
}

/** Frente de gabinete de servidores con hileras de LEDs. */
export function rackTexture(seed: number): THREE.CanvasTexture {
  return createPaintedTexture(32, seed, (ctx, random) => {
    ctx.fillStyle = '#121418'
    ctx.fillRect(0, 0, 32, 32)
    for (let y = 1; y < 32; y += 4) {
      ctx.fillStyle = '#1d2026'
      ctx.fillRect(1, y, 30, 3)
      for (let x = 3; x < 30; x += 3) {
        const r = random()
        ctx.fillStyle = r > 0.8 ? '#35ff7a' : r > 0.65 ? '#3a8fff' : r > 0.6 ? '#ffb020' : '#2a2e36'
        ctx.fillRect(x, y + 1, 1, 1)
      }
    }
  })
}

/** Pizarrón blanco con un diagrama a mano. */
export function whiteboardTexture(kind: 'arquitectura' | 'equipo', seed: number): THREE.CanvasTexture {
  return createPaintedTexture(64, seed, (ctx, random) => {
    ctx.fillStyle = '#d8dad6'
    ctx.fillRect(0, 0, 64, 64)
    speckle(ctx, random, 64, 60, '#c9cbc6')
    ctx.strokeStyle = kind === 'arquitectura' ? '#1f4fa8' : '#2b6b3a'
    ctx.lineWidth = 1
    if (kind === 'arquitectura') {
      // UI → BLoC → Repositorio → API / BD local
      ;[
        [6, 6, 22, 10],
        [6, 26, 22, 10],
        [6, 46, 22, 10],
        [38, 40, 20, 8],
        [38, 52, 20, 8],
      ].forEach(([x = 0, y = 0, w = 0, h = 0]) => ctx.strokeRect(x + 0.5, y + 0.5, w, h))
      ctx.beginPath()
      ctx.moveTo(17, 16)
      ctx.lineTo(17, 26)
      ctx.moveTo(17, 36)
      ctx.lineTo(17, 46)
      ctx.moveTo(28, 50)
      ctx.lineTo(38, 44)
      ctx.moveTo(28, 52)
      ctx.lineTo(38, 56)
      ctx.stroke()
      ctx.fillStyle = '#b3261e'
      ctx.font = '6px monospace'
      ctx.fillText('ADR', 40, 12)
      ctx.fillText('BLoC', 34, 30)
    } else {
      ctx.strokeRect(24.5, 6.5, 16, 10)
      ;[6, 22, 38, 54].forEach((x) => {
        ctx.strokeRect(x - 4.5, 40.5, 10, 8)
        ctx.beginPath()
        ctx.moveTo(32, 17)
        ctx.lineTo(x + 1, 40)
        ctx.stroke()
      })
      ctx.fillStyle = '#b3261e'
      ctx.fillRect(6, 56, 50, 1)
    }
  })
}

/** Lámina proyectada en la sala de juntas. */
export function slideTexture(): THREE.CanvasTexture {
  return createPaintedTexture(64, 81, (ctx) => {
    ctx.fillStyle = '#e8e4d8'
    ctx.fillRect(0, 0, 64, 40)
    ctx.fillStyle = '#20262e'
    ctx.font = '7px monospace'
    ctx.fillText('EXPERIENCIA', 4, 10)
    ctx.fillStyle = '#3a8fd1'
    ;[16, 22, 28, 34].forEach((y, i) => ctx.fillRect(4, y, 18 + i * 9, 3))
    ctx.fillStyle = '#05070a'
    ctx.fillRect(0, 40, 64, 24)
  })
}

/** Tablero de corcho con notas fijadas. */
export function corkTexture(seed: number): THREE.CanvasTexture {
  return createPaintedTexture(32, seed, (ctx, random) => {
    ctx.fillStyle = '#8a6a43'
    ctx.fillRect(0, 0, 32, 32)
    speckle(ctx, random, 32, 140, '#7a5c38')
    const colors = ['#e8e2c8', '#f2d06b', '#9ccbe8', '#e89c9c']
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = colors[i % colors.length] ?? '#e8e2c8'
      const x = 2 + Math.floor(random() * 22)
      const y = 2 + Math.floor(random() * 22)
      ctx.fillRect(x, y, 6 + Math.floor(random() * 3), 6)
      ctx.fillStyle = '#b3261e'
      ctx.fillRect(x + 3, y, 1, 1)
    }
  })
}

/** Cartel original para las paredes. */
export function posterTexture(lines: string[], background: string, color: string): THREE.CanvasTexture {
  return createTextTexture(lines, { width: 64, height: 80, color, background, fontSize: 9 })
}

/** Directorio de la planta: lista numerada de cuartos. */
export function directoryTexture(rooms: { number: number; name: string; open: boolean }[]): THREE.CanvasTexture {
  return createPaintedTexture(64, 99, (ctx) => {
    ctx.fillStyle = '#101317'
    ctx.fillRect(0, 0, 64, 64)
    ctx.fillStyle = '#c9b27a'
    ctx.font = '6px monospace'
    ctx.textBaseline = 'top'
    ctx.fillText('DIRECTORIO', 3, 2)
    rooms.forEach((room, i) => {
      ctx.fillStyle = room.open ? '#d9d4c7' : '#5d6573'
      ctx.fillText(`${String(room.number).padStart(2, ' ')} ${room.name.toUpperCase().slice(0, 13)}`, 2, 10 + i * 5)
    })
  })
}
