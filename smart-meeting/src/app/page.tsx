"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/ui/top/Header";
import Timetable from "@/app//components/ui/top/Timetable";
import { getRoomsWithReservationByDate } from "@/app/lib/data";
import { Room } from "@/app/types/room";
import { useSession } from "next-auth/react";
import CreateNewReservationModal from "./components/ui/top/modal/CreateNewReservationModal";
import Modal from "react-modal";
import { User } from "@/app/types/user";
import { getUser } from "@/app/lib/data";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";
import EditReservation from "./components/ui/top/modal/EditReservation";

export enum ModalController {
  None,
  Create,
  Edit,
}

export type InfoOfNewReservation = {
  room?: Room;

  startAt?: number;
};

export type InfoOfEditReservation = {
  reservationId?: string;
  room?: Room;

  startAt?: number;
};



Modal.setAppElement(".App");


export default function Home() {
  const date = new Date();
  const timetableStartTime = 7;
  const timetableEndTime = 22;
  const [selectedDate, setSelectedDate] = useState(date.toISOString().split("T")[0]);
  const [infoOfNewReservation, setInfoOfNewReservation] = useState<InfoOfNewReservation>({});
  const [InfoOfEditReservation, setInfoOfEditReservation] = useState<InfoOfEditReservation>({});

  const [rooms, setRooms] = useState<Room[]>([]);
  const [modalController, setModalController] = useState(ModalController.None);
  const [user, setUser] = useState<User>();
  const { data: session } = useSession();
  let userId: string;
  if (!session) {
    return <div>loading...</div>;
  } else {
    userId = session.user.id;
  }
    

  useEffect(() => {
    // startDateとendDateを作成

    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    startDate.setHours(timetableStartTime, 0, 0, 0);
    endDate.setHours(timetableEndTime, 0, 0, 0);

    (async() => {

      // getRoomsWithReservationByDateSpan(startDate, endDate)で、startDateからendDateまでの予約を、会議室に紐づけて取得
    
      const roomsWithReservationsByDate = await getRoomsWithReservationByDate(selectedDate );
      const data = await getUser(userId);
      if (!data) {
        toast.error("ユーザー情報が取得できませんでした");
        signOut();
      } else {
        setUser(data)
        setRooms(roomsWithReservationsByDate);
      }


    }) ();



  }, [selectedDate]);
  

  return (
    <div className="p-8 App">
      {/* ヘッダー */}
      <Header user={user} />

  {modalController === ModalController.Create && (

        <CreateNewReservationModal isOpen={true} room={infoOfNewReservation?.room} date={selectedDate} startAt={infoOfNewReservation.startAt} userId={userId}  setModalController={setModalController} />)
      }
      {modalController === ModalController.Edit && (
        
        <EditReservation reservationId={InfoOfEditReservation?.reservationId} isOpen={true} room={InfoOfEditReservation?.room} date={selectedDate} startAt={infoOfNewReservation.startAt} userId={userId}  setModalController={setModalController} />)
      }
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
          <Timetable rooms={rooms} setModalController={setModalController} setInfoOfNewReservation={setInfoOfNewReservation} setInfoOfEditReservation={setInfoOfEditReservation}/>

          {/* Room Time Slots */}

        </div>



          {/* New Reservation Form */}
                
      </div>
    </div>
  );
}
