import { Character } from '../components/Character'
import { CRTMonitor } from '../components/CRTMonitor'
import { Door } from '../components/Door'
import { FixedCamera } from '../components/FixedCamera'
import { FluorescentLamp } from '../components/FluorescentLamp'
import { Room } from '../components/Room'
import { CAMERA } from '../world/layout'

const FOG_COLOR = '#111111'

/** Primera escena: el cuarto abandonado con el monitor y la puerta cerrada. */
export function FirstRoom() {
  return (
    <>
      <color attach="background" args={[FOG_COLOR]} />
      <fog attach="fog" args={[FOG_COLOR, 4, 14]} />
      <ambientLight color="#8fa39a" intensity={0.35} />
      {/* Luz de relleno desde la cámara: mantiene legible al personaje en la penumbra */}
      <directionalLight position={CAMERA.position} color="#c9d2cc" intensity={0.9} />

      <FixedCamera />
      <FluorescentLamp />
      <Room />
      <Door />
      <CRTMonitor />
      <Character />
    </>
  )
}
