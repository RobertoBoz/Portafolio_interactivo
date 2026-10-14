import { Building } from '../components/Building'
import { CameraRig } from '../components/CameraRig'
import { Character } from '../components/Character'
import { useGameStore } from '../store/gameStore'
import { cameraFor } from '../world/building'

const FOG_COLOR = '#0b0c0f'

/** Escena principal: la planta baja de la oficina, de noche. */
export function Office() {
  const room = useGameStore((state) => state.room)
  // Luz de relleno desde la cámara del cuarto: mantiene legible al personaje.
  const shot = cameraFor(room, 0, 0)
  // La luz direccional solo usa la dirección: de la cámara hacia lo que mira.
  const fill: [number, number, number] = shot
    ? [shot.position[0] - shot.target[0], shot.position[1] - shot.target[1], shot.position[2] - shot.target[2]]
    : [0, 3, 2]

  return (
    <>
      <color attach="background" args={[FOG_COLOR]} />
      <fog attach="fog" args={[FOG_COLOR, 5, 17]} />
      <ambientLight color="#8b98a8" intensity={0.32} />
      <directionalLight position={fill} color="#c9d2cc" intensity={0.7} />

      <CameraRig />
      <Building />
      <Character />
    </>
  )
}
