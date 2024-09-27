"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/ui/top/Header";
import Timetable from "@/app//components/ui/top/Timetable";
import { getRoomsWithReservationByDateSpan } from "./lib/data";
import { time } from "console";
import { Room } from "@/app/types/room";
import { useSession } from "next-auth/react";

export default function Home() {
  const date = new Date();
  const timetableStartTime = 7;
  const timetableEndTime = 22;
  //var roomsWithReservationsByDate: Room[]= [];
  const [selectedDate, setSelectedDate] = useState(date.toISOString().split("T")[0]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const { data: session } = useSession();

  console.log(session?.user);
  console.log(session?.user.id);

  useEffect(() => {
    // startDateとendDateを作成

    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    startDate.setHours(timetableStartTime, 0, 0, 0);
    endDate.setHours(timetableEndTime, 0, 0, 0);
    var roomsWithReservationsByDate: Room[] = [];
    (async() => {

      // getRoomsWithReservationByDateSpan(startDate, endDate)で、startDateからendDateまでの予約を、会議室に紐づけて取得
      

      roomsWithReservationsByDate = await getRoomsWithReservationByDateSpan(timetableStartTime, timetableEndTime);
      setRooms(roomsWithReservationsByDate);
    }) ();
    console.log(roomsWithReservationsByDate);



  }, [selectedDate]);
  

  return (
    <div className="p-8">
      {/* ヘッダー */}

      <Header />
      {/* メイン */}
      <div className="flex mt-8">
        {/* Left: Reservation List */}
        <div className="flex-2 mr-8 basis-3/4">
          <h2 className="text-xl font-semibold">予約一覧</h2>
          {/* 日付の選択 */}
          <label className="block mt-4">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded mt-1 p-2"
          />
          <Timetable rooms={rooms}/>

          {/* Room Time Slots */}

          <div className="flex items-center mt-6">
            <button className="text-lg">{"<"}</button>
            <div className="flex-1 flex justify-around">
              <div className="text-center">会議室A</div>
              <div className="text-center">会議室B</div>
              <div className="text-center">会議室C</div>
              <div className="text-center">会議室D</div>
            </div>
            <button className="text-lg">{">"}</button>
          </div>

          {/* Time Slots */}
          <div className="relative mt-6 border-l border-black h-[600px]">
            {[...Array(17)].map((_, i) => (
              <div
                key={i}
                className="h-8 border-b border-gray-300 text-gray-600"
              >
                {6 + i}:00
              </div>
            ))}

            {/* Sample Reservation Block */}
            <div className="absolute top-40 left-0 bg-gray-300 w-24 h-16 text-center leading-[4rem]">
              橋本
            </div>
          </div>
        </div>

        {/* Right: Reservation Details */}
        <div className="flex-1 border-l border-black pl-8 basis-1/4">
          {/* Reservation Info */}
          <div className="mb-16">
            <h3 className="text-lg font-semibold">会議室A</h3>
            <p>予約者：橋本（あなた）</p>
            <p>開始：10:20</p>
            <p>終了：12:40</p>
            <p className="mt-4">説明</p>
            <p>X社さんとの面談</p>
            <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
              削除
            </button>
          </div>

          {/* New Reservation Form */}
          <div>
            <h3 className="text-lg font-semibold">会議室Aを予約</h3>
            <div className="mt-4">
              <label className="block">予約日</label>
              <input
                type="text"
                value={selectedDate}
                readOnly
                className="border border-gray-300 rounded p-2 mt-1 w-full"
              />
            </div>
            <div className="mt-4">
              <label className="block">開始時刻</label>
              <input
                type="text"
                className="border border-gray-300 rounded p-2 mt-1 w-full"
              />
            </div>
            <div className="mt-4">
              <label className="block">終了時刻</label>
              <input
                type="text"
                className="border border-gray-300 rounded p-2 mt-1 w-full"
              />
            </div>
            <div className="mt-4">
              <label className="block">説明</label>
              <textarea className="border border-gray-300 rounded p-2 mt-1 w-full h-24"></textarea>
            </div>
            <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded">
              予約
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
