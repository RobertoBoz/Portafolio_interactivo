/**
 * "Vertex snapping": redondea la posición proyectada de cada vértice a una
 * rejilla de baja resolución, como el hardware de PlayStation 1, que no tenía
 * precisión subpíxel. Produce el temblor característico de los polígonos.
 *
 * Todos los materiales comparten el uniforme `PS1_SNAP`, así que el efecto se
 * activa o desactiva en tiempo real desde los ajustes sin recompilar shaders.
 */
export const PS1_SNAP = { value: 1 }

export function ps1VertexSnap(shader: { vertexShader: string; uniforms: Record<string, { value: unknown }> }): void {
  shader.uniforms.uPs1Snap = PS1_SNAP
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nuniform float uPs1Snap;')
    .replace(
      '#include <project_vertex>',
      `#include <project_vertex>
      if (uPs1Snap > 0.5) {
        vec2 grid = vec2(160.0, 120.0);
        vec4 snapped = gl_Position;
        snapped.xy = floor((snapped.xy / snapped.w) * grid + 0.5) / grid * snapped.w;
        gl_Position = snapped;
      }`,
    )
}
