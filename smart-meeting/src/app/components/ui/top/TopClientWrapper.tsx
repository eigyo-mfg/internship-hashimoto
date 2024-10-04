import Timetable from "@/app/components/ui/top//Timetable";
import {
  InfoOfEditReservation,
  InfoOfNewReservation,
  ModalController,
} from "@/app/page";
import { Room } from "@/app/types/room";

interface Props {
  selectedDate: Date;
  date: Date;
  dataFetched: boolean;
  rooms: Room[];
  currentPage: number;
  setModalController: React.Dispatch<React.SetStateAction<ModalController>>;
  setInfoOfNewReservation: React.Dispatch<
    React.SetStateAction<InfoOfNewReservation>
  >;
  setInfoOfEditReservation: React.Dispatch<
    React.SetStateAction<InfoOfEditReservation>
  >;
}

// トップページのクライアント側のラッパー
// ローディング中、ルームがない場合、ルームがある場合の表示を行う
export default function TopClientWrapper({
  selectedDate,
  date,
  dataFetched,
  rooms,
  currentPage,
  setModalController,
  setInfoOfNewReservation,
  setInfoOfEditReservation,
}: Props) {
  const perPage = 5;
  if (dataFetched === false) {
    return <div className="text-center text-xl">loading...</div>;
  } else if (rooms.length === 0) {
    return <div className="text-center text-lg">ルームがありません</div>;
  }
  return (
    <div>
      <Timetable
        selectedDate={selectedDate}
        date={date}
        rooms={rooms.slice(perPage * (currentPage - 1), perPage * currentPage)}
        setModalController={setModalController}
        setInfoOfNewReservation={setInfoOfNewReservation}
        setInfoOfEditReservation={setInfoOfEditReservation}
      />
    </div>
  );
}
