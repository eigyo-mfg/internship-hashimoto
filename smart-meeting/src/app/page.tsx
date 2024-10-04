"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/ui/top/Header";
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
import TopClientWrapper from "@/app/components/ui/top/TopClientWrapper";


// 表示するモーダルの種類
export enum ModalController {
  None,
  Create,
  Edit,
}

// 新規予約の情報
export type InfoOfNewReservation = {
  room?: Room;

  startAt?: number;
};

// 予約編集の情報
export type InfoOfEditReservation = {
  reservation?: Reservation;
  room?: Room;

  startAt?: number;
};

// モーダルのスタイルを設定
Modal.setAppElement(".App");

export default function Home() {
  const date = new Date();
  const timetableStartTime = 7;
  const timetableEndTime = 22;
  const perPage = 5;
  // 表示する予約の日付
  const [selectedDate, setSelectedDate] = useState(
    date
      .toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replaceAll("/", "-"),
  );
  // 新規予約の情報
  const [infoOfNewReservation, setInfoOfNewReservation] =
    useState<InfoOfNewReservation>({});
  // 予約編集の情報
  const [InfoOfEditReservation, setInfoOfEditReservation] =
    useState<InfoOfEditReservation>({});
  // 会議室の予約情報
  const [rooms, setRooms] = useState<Room[]>([]);
  // モーダルの状態
  const [modalController, setModalController] = useState(ModalController.None);
  // ユーザー情報
  const [user, setUser] = useState<User>();
  const [currentPage, setCurrentPage] = useState(1);
  // セッション情報
  const { data: session } = useSession();
  // データが取得済みかどうか
  const [dataFetched, setDataFetched] = useState(false);
  let userId: number;
  // セッションが取得できていない場合はローディング画面を表示
  if (!session) {
    return <div>loading...</div>;
  } else {
    userId = parseInt(session.user.id as string);
  }

  useEffect(() => {
    // 予約情報を取得
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    startDate.setHours(timetableStartTime, 0, 0, 0);
    endDate.setHours(timetableEndTime, 0, 0, 0);

    (async () => {
      // getRoomsWithReservationByDateSpan(startDate, endDate)で、startDateからendDateまでの予約を、会議室に紐づけて取得

      const roomsWithReservationsByDate =
        await getRoomsWithReservationByDate(selectedDate);
      const data = await getUser(userId);
      setDataFetched(true);

      if (!data) {
        // ユーザー情報が取得できなかった場合はログアウト
        toast.error("ユーザー情報が取得できませんでした");
        signOut();
      } else {
        // ユーザー情報をセット
        setUser(data);
        setRooms(roomsWithReservationsByDate);
      }
    })();
  }, [selectedDate]);

  return (
    <div className="p-8 App">
      {/* ヘッダー */}
      <Header user={user} />

      {modalController === ModalController.Create && (
        <CreateNewReservationModal
          isOpen={true}
          room={infoOfNewReservation?.room}
          date={selectedDate}
          startAt={infoOfNewReservation.startAt}
          userId={userId}
          setModalController={setModalController}
        />
      )}
      {modalController === ModalController.Edit && (
        <EditReservation
          roomName={InfoOfEditReservation.room?.name}
          reservation={InfoOfEditReservation.reservation}
          isOpen={true}
          date={selectedDate}
          startAt={InfoOfEditReservation.startAt}
          userId={userId}
          setModalController={setModalController}
        />
      )}
      {/* メイン */}
      <div className="mt-8">
        {/* Left: Reservation List */}
        <div className="flex-2 mr-8 basis-3/4">
          {/* 日付の選択 */}
          <div className="text-right text-base">
            <label className="block mt-4">
              Date：
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded mt-1 p-2"
              />
            </label>
          </div>
          {/*  ＜　予約一覧 ＞ */}
          <div className="text-center my-2 text-lg">
            <button
              className="mx-16 my-2 disabled:text-gray-100 "
              disabled={currentPage === 1}
              onClick={() => {
                if (currentPage === 1) {
                  return;
                } else {
                  setCurrentPage(currentPage - 1);
                }
              }}
            >
              ＜
            </button>
            予約一覧
            <button
              className="mx-16 my-2 disabled:text-gray-100 "
              disabled={perPage * currentPage >= rooms.length}
              onClick={() => {
                if (perPage * currentPage >= rooms.length) {
                  return;
                } else {
                  setCurrentPage(currentPage + 1);
                }
              }}
            >
              ＞
            </button>
          </div>
          {/*  タイムテーブルを表示する */}

          <TopClientWrapper
            selectedDate={new Date(Date.parse(selectedDate))}
            date={date}
            dataFetched={dataFetched}
            rooms={rooms}
            currentPage={currentPage}
            setModalController={setModalController}
            setInfoOfNewReservation={setInfoOfNewReservation}
            setInfoOfEditReservation={setInfoOfEditReservation}
          />
        </div>

        {/* New Reservation Form */}
      </div>
    </div>
  );
}
