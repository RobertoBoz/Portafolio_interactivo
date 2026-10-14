import { Building } from '../components/Building'
import { DEBUG, DebugStats } from '../components/DebugStats'
import { CameraRig } from '../components/CameraRig'
import { CharacterAvatar } from '../components/CharacterAvatar'
import { FirstPersonCamera } from '../components/FirstPersonCamera'
import { PlayerController } from '../components/PlayerController'
import { useGameStore } from '../store/gameStore'
import { cameraFor } from '../world/building'

const FOG_COLOR = '#0b0c0f'

/** Escena principal: la planta baja de la oficina, de noche. */
export function Office() {
  const room = useGameStore((state) => state.room)
  const firstPerson = useGameStore((state) => state.settings.cameraMode === 'firstPerson')
  const shot = cameraFor(room, 0, 0)
  // Luz de relleno desde la cámara fija del cuarto (solo importa la dirección).
  const fill: [number, number, number] = shot
    ? [shot.position[0] - shot.target[0], shot.position[1] - shot.target[1], shot.position[2] - shot.target[2]]
    : [0, 3, 2]

  return (
    <>
      <color attach="background" args={[FOG_COLOR]} />
      <fog attach="fog" args={[FOG_COLOR, firstPerson ? 4 : 5, firstPerson ? 15 : 17]} />
      <ambientLight color="#8b98a8" intensity={firstPerson ? 0.42 : 0.5} />
      <directionalLight position={fill} color="#c9d2cc" intensity={firstPerson ? 0.5 : 0.85} />

      {DEBUG && <DebugStats />}
      <PlayerController />
      {firstPerson ? <FirstPersonCamera /> : <CameraRig />}
      <Building />
      {!firstPerson && <CharacterAvatar />}
    </>
  )
}
