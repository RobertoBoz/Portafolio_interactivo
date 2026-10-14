/**
 * "Vertex snapping": redondea la posición proyectada de cada vértice a una
 * rejilla de baja resolución, igual que el hardware de PlayStation 1, que no
 * tenía precisión subpíxel. Produce el temblor característico de los polígonos.
 *
 * Se usa como `onBeforeCompile` en cualquier material estándar de three.js.
 */
const SNAP_RESOLUTION = 'vec2(320.0, 240.0)'

export function ps1VertexSnap(shader: { vertexShader: string }): void {
  shader.vertexShader = shader.vertexShader.replace(
    '#include <project_vertex>',
    `#include <project_vertex>
    {
      vec2 grid = ${SNAP_RESOLUTION} * 0.5;
      vec4 snapped = gl_Position;
      snapped.xy = floor((snapped.xy / snapped.w) * grid + 0.5) / grid * snapped.w;
      gl_Position = snapped;
    }`,
  )
}
