import React from 'react'
import { Room } from '@/app/types/room';
import { InfoOfEditReservation, InfoOfNewReservation } from '@/app/page';
import { ModalController } from '@/app/page';

interface Props {
  rooms: Room[];
  setModalController: React.Dispatch<React.SetStateAction<ModalController>>;
  setInfoOfNewReservation: React.Dispatch<React.SetStateAction<InfoOfNewReservation>>;
  setInfoOfEditReservation: React.Dispatch<React.SetStateAction<InfoOfEditReservation>>;
}


export default function Timetable({ rooms, setModalController, setInfoOfNewReservation, setInfoOfEditReservation }: Props) {

    const timetableStartTime = 7;
    const timetableEndTime = 22;
    const roomsIndexList: number[] = Array.from({length: rooms.length}, () => 0);
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

                return (
                    <tr key={i} className='border-b-2 border-black-500 h-12'>
                        <th className='w-16'>{timetableStartTime + i}:00-{timetableStartTime + i + 1}:00</th>
                        {rooms.map((room: Room, j: number) => {
                          if (!room.Reservations) {
                            console.error('room.Reservations is undefined');
                            return 
                          }
                          var reservation = room.Reservations[roomsIndexList[j]];
                          if (reservation && reservation.startAt === startTime) {
                            roomsIndexList[j] += 1;
                            console.log(roomsIndexList);
                            return <td className='border-x-2 text-center' key={j}>{
                              <button onClick={
                                () => {
                                  setModalController(ModalController.Edit);
                                  setInfoOfEditReservation({
                                    room: room,
                                    startAt:timetableStartTime + i,
                                    reservationId: reservation.id,
                                  });
                                }
                              }  key={j
                              }><div>
                                <p>{reservation.user?.lastName} {reservation.description && "*"}</p>
                      
                              </div>
                              </button>
                            }</td>

                          } else {
                            return <td className="border-x-2 text-center" key={j}>{
                        <button onClick={
                          () => { 
                            setModalController(ModalController.Create);
                            setInfoOfNewReservation({
                              room: room,
                              startAt:timetableStartTime + i,
                            });
                          }
                        } className='text-3xl m-2 text-green-600 align-center'>+</button>
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
