import { GameCanvas } from './components/GameCanvas'
import { Hud } from './components/ui/Hud'
import { NoWebGL, hasWebGL } from './components/ui/NoWebGL'
import { useInteractionKeys } from './hooks/useInteractionKeys'
import { usePointerLockSync } from './hooks/usePointerLockSync'
import { useGameStore } from './store/gameStore'

const WEBGL = hasWebGL()

export default function App() {
  useInteractionKeys()
  usePointerLockSync()
  const screenEffects = useGameStore((state) => state.settings.screenEffects)

  if (!WEBGL) return <NoWebGL />

  return (
    <main className="game">
      <GameCanvas />
      {screenEffects && <div className="screen-overlay" aria-hidden="true" />}
      <Hud />
    </main>
  )
}
