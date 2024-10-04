import React from "react";
import { Room } from "@/app/types/room";
import { InfoOfEditReservation, InfoOfNewReservation } from "@/app/page";
import { ModalController } from "@/app/page";

interface Props {
  selectedDate: Date;
  date: Date;
  rooms: Room[];
  setModalController: React.Dispatch<React.SetStateAction<ModalController>>;
  setInfoOfNewReservation: React.Dispatch<
    React.SetStateAction<InfoOfNewReservation>
  >;
  setInfoOfEditReservation: React.Dispatch<
    React.SetStateAction<InfoOfEditReservation>
  >;
}

// トップページのタイムテーブル
export default function Timetable({
  selectedDate,
  date,
  rooms,
  setModalController,
  setInfoOfNewReservation,
  setInfoOfEditReservation,
}: Props) {
  const timetableStartTime = 7;
  const timetableEndTime = 22;
  const roomsIndexList: number[] = Array.from(
    { length: rooms.length },
    () => 0,
  );
  return (
    <div>
      <table className="w-full">
        <thead className="border-b-2">
          <tr>
            <th className="w-28" scope="row"></th>
            {rooms.map((room: Room, i: number) => {
              return (
                <th className="border-x-2" key={i}>
                  {room.name}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({
            length: timetableEndTime - timetableStartTime + 1,
          }).map((_, i) => {
            var startTime = timetableStartTime + i;
            selectedDate.setHours(startTime + 1, 0, 0, 0);
            return (
              <tr key={i} className="border-b-2 border-black-500 h-6">
                <th className="w-16">
                  {timetableStartTime + i}:00-{timetableStartTime + i + 1}:00
                </th>
                {rooms.map((room: Room, j: number) => {
                  if (!room.Reservations) {
                    console.error("room.Reservations is undefined");
                    return;
                  }
                  var reservation = room.Reservations[roomsIndexList[j]];
                  if (reservation && reservation.startAt === startTime) {
                    roomsIndexList[j] += 1;
                    return (
                      <td
                        className="border-x-2 text-center text-green-800"
                        key={j}
                      >
                        {
                          <button
                            disabled={selectedDate < date}
                            className="disabled:text-slate-300"
                            onClick={() => {
                              // モーダルを開く
                              setModalController(ModalController.Edit);
                              // 予約情報をトップページにセット
                              setInfoOfEditReservation({
                                room: room,
                                startAt: timetableStartTime + i,
                                reservation: reservation,
                              });
                            }}
                            key={j}
                          >
                            <div>
                              <p>
                                {reservation.user?.lastName}{" "}
                                {reservation.description && "*"}
                              </p>
                            </div>
                          </button>
                        }
                      </td>
                    );
                  } else {
                    return (
                      <td className="border-x-2 text-center" key={j}>
                        {
                          <button
                            disabled={selectedDate < date}
                            onClick={() => {
                              // モーダルを開く
                              setModalController(ModalController.Create);
                              // 新規予約情報をトップページにセット
                              setInfoOfNewReservation({
                                room: room,
                                startAt: timetableStartTime + i,
                              });
                            }}
                            className="text-3xl m-2 text-green-600 align-center disabled:text-slate-300"
                          >
                            +
                          </button>
                        }
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
