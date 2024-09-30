"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/ui/top/Header";
import Timetable from "@/app//components/ui/top/Timetable";
import { getRoomsWithReservationByDate } from "@/app/lib/data";
import { Room } from "@/app/types/room";
import { useSession } from "next-auth/react";
import CreateNewReservationModal from "@/app/components/ui/top/modal/CreateNewReservationModal";
import Modal from "react-modal";
import { User } from "@/app/types/user";
import { getUser } from "@/app/lib/data";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";
import EditReservation from "@/app/components/ui/top/modal/EditReservation";
import { Reservation } from "@/app/types/reservation";

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
  reservation?: Reservation;
  room?: Room;

  startAt?: number;
};



Modal.setAppElement(".App");


export default function Home() {
  const date = new Date();
  const timetableStartTime = 7;
  const timetableEndTime = 22;
  const perPage = 5
  const [selectedDate, setSelectedDate] = useState(date.toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit",
    day: "2-digit"}).replaceAll('/', '-'));
  const [infoOfNewReservation, setInfoOfNewReservation] = useState<InfoOfNewReservation>({});
  const [InfoOfEditReservation, setInfoOfEditReservation] = useState<InfoOfEditReservation>({});
  const [rooms, setRooms] = useState<Room[]>([]);
  const [modalController, setModalController] = useState(ModalController.None);
  const [user, setUser] = useState<User>();
  const [currentPage, setCurrentPage] = useState(1);
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
        setUser(data);
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
        
        <EditReservation roomName={InfoOfEditReservation.room?.name} reservation={InfoOfEditReservation.reservation} isOpen={true} date={selectedDate} startAt={infoOfNewReservation.startAt} userId={userId}  setModalController={setModalController} />)
      }
      {/* メイン */}
      <div className="mt-8">
        {/* Left: Reservation List */}
        <div className="flex-2 mr-8 basis-3/4">
          {/* 日付の選択 */}
          <div className="text-right text-xl">
          <label className="block mt-4">Date：
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded mt-1 p-2"
          /></label>
          </div>
          <div className="text-center my-8 text-2xl">
          <button className="mx-16 my-4 disabled:text-gray-100 " disabled={currentPage === 1} onClick={()=> {
            if (currentPage === 1) {
              return
            } else {

            setCurrentPage(currentPage - 1)
            }


          }}>＜</button>予約一覧
            <button className="mx-16 my-4 disabled:text-gray-100 " disabled={perPage * currentPage >= rooms.length} onClick={() => {
              if (perPage * currentPage >= rooms.length) {
                return
              } else {
                setCurrentPage(currentPage + 1)
              }
            }}>＞</button>
          </div>


          <Timetable rooms={rooms.slice(perPage * (currentPage - 1), perPage * currentPage )} setModalController={setModalController} setInfoOfNewReservation={setInfoOfNewReservation} setInfoOfEditReservation={setInfoOfEditReservation}/>

          {/* Room Time Slots */}

        </div>



          {/* New Reservation Form */}
                
      </div>
    </div>
  );
}
