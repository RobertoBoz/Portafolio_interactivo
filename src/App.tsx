import { GameCanvas } from './components/GameCanvas'
import { Hud } from './components/ui/Hud'
import { useInteractionKeys } from './hooks/useInteractionKeys'

export default function App() {
  useInteractionKeys()

  return (
    <main className="game">
      <GameCanvas />
      <Hud />
      <div className="screen-overlay" aria-hidden="true" />
    </main>
  )
}
