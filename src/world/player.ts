import { START, type RoomId } from './building'

/**
 * Posición del personaje compartida fuera de React. El personaje la escribe
 * cada fotograma; la cámara y el mapa la leen. Evita re-renderizar por movimiento.
 */
export const player: { room: RoomId; x: number; z: number; heading: number } = {
  room: START.room,
  x: START.x,
  z: START.z,
  heading: START.heading,
}
