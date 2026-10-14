import { useGameStore } from '../../store/gameStore'
import { ROOMS } from '../../world/building'

/** Nombre del cuarto al entrar, como en los survival horror clásicos. */
export function RoomTitle() {
  const room = useGameStore((state) => state.room)
  const transitioning = useGameStore((state) => state.transitioning)
  const { number, name } = ROOMS[room]
  if (transitioning) return null
  return (
    <div key={room} className="room-title" aria-live="polite">
      <span className="room-title__number">{String(number).padStart(2, '0')}</span>
      {name.toUpperCase()}
    </div>
  )
}
