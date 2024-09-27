import React from 'react'
import { Room } from '@/app/types/room';
import { SelectedReservation } from '@/app/types/selectedReservation';
import { useSession } from 'next-auth/react';

export default function Timetable({ rooms }: {rooms: Room[]}) {

    const timetableStartTime = 7;
    const timetableEndTime = 22;
  return (
    <div>
      <table>
        <thead className='border-b-2'>      
            <tr>  
            <th className='' scope='row'></th>
        {rooms.map((room: Room, i: number) => {

            return <th className='border-x-2' key={i}>{room.name}</th>
        })}
        </tr>
        </thead>
        <tbody>
            {Array.from({length: timetableEndTime - timetableStartTime + 1}).map((_, i) => {
              var startTime = timetableStartTime + i;
              var endTime = timetableStartTime + i + 1;

                return (
                    <tr key={i} className='border-b-2 border-black-500 h-12'>
                        <th className='w-16'>{timetableStartTime + i}:00-{timetableStartTime + i + 1}:00</th>
                        {rooms.map((room: Room, j: number) => {
                          var reservationCount = 0;
                          // 予約がその時間にあるかどうかを確認(予約は開始時間順でソートされている)
                          if (room.Reservations !== undefined && room.Reservations.length > 0 && room.Reservations[reservationCount].startAt === startTime) {
                            const reservation = room.Reservations[reservationCount];
                            reservationCount++;
                            return <td className='border-x-2 text-center' key={j}>{
                              <button><div>
                                <p>{reservation.user?.lastName} {reservation.description && "*"}</p>
                      
                              </div>
                              </button>
                            }</td>

                          } else {
                            return <td className="border-x-2 text-center" key={j}>{
                        <button className='text-3xl m-2 text-green-600 align-center'>+</button>
                              }</td>
                          }
                        })}
                    </tr>
                )
            })}
        </tbody>

      </table>

    </div>
  )
}
