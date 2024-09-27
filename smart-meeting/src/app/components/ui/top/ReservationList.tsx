import { Room } from '@/app/types/room';
import React from 'react'

interface Props {
    rooms: Room[];
    setSelectedReservation: React.Dispatch<React.SetStateAction<string>>;
}

export default function ReservationList({ rooms, setSelectedReservation }: Props) {
  return (
    <div>
        {rooms.map((room: Room) => {
            return (
                <div>
                    <p>{room.name}</p>
                </div>
            )
        })}
    </div>
  )
}
