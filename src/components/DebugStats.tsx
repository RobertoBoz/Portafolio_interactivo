import { useFrame, useThree } from '@react-three/fiber'

type RenderStats = { calls: number; triangles: number; programs: number; geometries: number; textures: number; frameMs: number }

declare global {
  interface Window {
    __portafolioRender?: RenderStats
  }
}

/**
 * Solo con ?debug: publica estadísticas del renderer en `window.__portafolioRender`
 * para medir rendimiento (llamadas de dibujo, triángulos, programas, tiempo por fotograma).
 */
export function DebugStats() {
  const gl = useThree((state) => state.gl)
  useFrame((_, delta) => {
    const { render, memory, programs } = gl.info
    window.__portafolioRender = {
      calls: render.calls,
      triangles: render.triangles,
      programs: programs?.length ?? 0,
      geometries: memory.geometries,
      textures: memory.textures,
      frameMs: delta * 1000,
    }
  })
  return null
}

export const DEBUG = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')
