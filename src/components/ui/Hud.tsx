import { hasOverlay, isPaused, useGameStore } from '../../store/gameStore'
import { ControlsHint } from './ControlsHint'
import { Crosshair } from './Crosshair'
import { FadeOverlay } from './FadeOverlay'
import { IndexPanel } from './IndexPanel'
import { InteractionPrompt } from './InteractionPrompt'
import { Inventory } from './Inventory'
import { MapOverlay } from './MapOverlay'
import { MessageBox } from './MessageBox'
import { PauseMenu } from './PauseMenu'
import { RoomTitle } from './RoomTitle'
import { SettingsPanel } from './SettingsPanel'
import { StartScreen } from './StartScreen'
import { TerminalPanel } from './TerminalPanel'

/** Capa HTML sobre el canvas: menús, ayudas, diálogos, terminales, plano e índice. */
export function Hud() {
  const started = useGameStore((state) => state.started)
  const panel = useGameStore((state) => state.panel)
  const message = useGameStore((state) => state.message)
  const mapOpen = useGameStore((state) => state.mapOpen)
  const indexOpen = useGameStore((state) => state.indexOpen)
  const settingsOpen = useGameStore((state) => state.settingsOpen)
  const paused = useGameStore(isPaused)
  const overlay = useGameStore(hasOverlay)
  const firstPerson = useGameStore((state) => state.settings.cameraMode === 'firstPerson')

  return (
    <div className="hud">
      {started && (
        <>
          <ControlsHint />
          <RoomTitle />
          <Inventory />
          {firstPerson && !overlay && !paused && <Crosshair />}
          <InteractionPrompt />
          {message && <MessageBox lines={message} />}
          {panel && <TerminalPanel id={panel} />}
          {mapOpen && <MapOverlay />}
          {paused && <PauseMenu />}
        </>
      )}
      {!started && !indexOpen && !settingsOpen && <StartScreen />}
      {indexOpen && <IndexPanel />}
      {settingsOpen && <SettingsPanel />}
      <FadeOverlay />
    </div>
  )
}
