import type { ReactNode } from 'react'
import { ROOMS, doorsOf, type RoomId } from '../world/building'
import { useGameStore } from '../store/gameStore'
import { DoorPanel } from './rooms/DoorPanel'
import { RoomShell } from './rooms/RoomShell'
import { Lobby } from './rooms/Lobby'
import { Reception } from './rooms/Reception'
import { Development } from './rooms/Development'
import { PrivateOffice } from './rooms/PrivateOffice'
import { MeetingRoom } from './rooms/MeetingRoom'
import { BreakRoom } from './rooms/BreakRoom'
import { ServerRoom } from './rooms/ServerRoom'
import { ProjectArchive } from './rooms/ProjectArchive'
import { TechLab } from './rooms/TechLab'

const FURNITURE: Partial<Record<RoomId, () => ReactNode>> = {
  lobby: () => <Lobby />,
  recepcion: () => <Reception />,
  desarrollo: () => <Development />,
  oficina: () => <PrivateOffice />,
  juntas: () => <MeetingRoom />,
  comedor: () => <BreakRoom />,
  servidores: () => <ServerRoom />,
  almacen: () => <ProjectArchive />,
  diseno: () => <TechLab />,
}

const FLOORS: Partial<Record<RoomId, { floor: string; wall: string }>> = {
  lobby: { floor: '#36383e', wall: '#4a505a' },
  recepcion: { floor: '#393633', wall: '#4d4945' },
  desarrollo: { floor: '#32353c', wall: '#454c58' },
  oficina: { floor: '#3a352f', wall: '#4e4740' },
  juntas: { floor: '#33302d', wall: '#4a4642' },
  comedor: { floor: '#3a3a36', wall: '#4f5248' },
  servidores: { floor: '#2a2e35', wall: '#3a4250' },
  almacen: { floor: '#34322e', wall: '#47443e' },
  diseno: { floor: '#30343a', wall: '#464d55' },
}

/**
 * Planta completa. Solo el cuarto actual es visible: así sus luces son las
 * únicas que cuentan y la escena se mantiene ligera.
 */
export function Building() {
  const current = useGameStore((state) => state.room)

  return (
    <>
      {Object.values(ROOMS)
        .filter((room) => room.built)
        .map((room) => {
          const furniture = FURNITURE[room.id]
          const palette = FLOORS[room.id]
          return (
            <group key={room.id} visible={room.id === current}>
              <RoomShell room={room} floor={palette?.floor} wall={palette?.wall} />
              {doorsOf(room.id).map((door) => (
                <DoorPanel key={door.id} door={door} room={room.id} />
              ))}
              {furniture?.()}
            </group>
          )
        })}
    </>
  )
}
