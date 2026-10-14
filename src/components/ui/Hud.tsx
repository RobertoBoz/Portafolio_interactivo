import { useGameStore } from '../../store/gameStore'
import { ControlsHint } from './ControlsHint'
import { FadeOverlay } from './FadeOverlay'
import { InteractionPrompt } from './InteractionPrompt'
import { Inventory } from './Inventory'
import { MapOverlay } from './MapOverlay'
import { MessageBox } from './MessageBox'
import { RoomTitle } from './RoomTitle'
import { TerminalPanel } from './TerminalPanel'

/** Capa HTML sobre el canvas: ayudas, indicadores, diálogos, terminales y mapa. */
export function Hud() {
  const panel = useGameStore((state) => state.panel)
  const message = useGameStore((state) => state.message)
  const mapOpen = useGameStore((state) => state.mapOpen)

  return (
    <div className="hud">
      <ControlsHint />
      <RoomTitle />
      <Inventory />
      <InteractionPrompt />
      {message && <MessageBox lines={message} />}
      {panel && <TerminalPanel id={panel} />}
      {mapOpen && <MapOverlay />}
      <FadeOverlay />
    </div>
  )
}
