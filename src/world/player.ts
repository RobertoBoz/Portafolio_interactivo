import { START, type RoomId } from './building'

/**
 * Estado del jugador compartido fuera de React. El controlador lo escribe cada
 * fotograma; cámaras, avatar y mapa lo leen sin provocar renders.
 *
 * `heading`: dirección horizontal; el frente es (sin heading, cos heading).
 * `pitch`: inclinación de la mirada en primera persona (radianes, + = arriba).
 */
export const player: {
  room: RoomId
  x: number
  z: number
  heading: number
  pitch: number
  speed: number
} = {
  room: START.room,
  x: START.x,
  z: START.z,
  heading: START.heading,
  pitch: 0,
  speed: 0,
}
