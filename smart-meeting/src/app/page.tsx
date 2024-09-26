"use client";

import { useState } from "react";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("2024-10-09");

  return (
    <div className="p-8">
      {/* ヘッダー */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Smart Meeting</h1>
        <div>
          <span>橋本一希（ユーザー）</span>
          <button className="ml-4 px-4 py-2 bg-red-500 text-white rounded">
            ログアウト
          </button>
        </div>
      </header>

      {/* メイン */}
      <div className="flex mt-8">
        {/* Left: Reservation List */}
        <div className="flex-2 mr-8 basis-3/4">
          <h2 className="text-xl font-semibold">予約一覧</h2>
          <label className="block mt-4">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded mt-1 p-2"
          />

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
