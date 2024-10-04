import Modal from "react-modal";
import React, { useState, useRef } from "react";
import { Room } from "@/app/types/room";
import { InfoOfNewReservation, ModalController } from "@/app/page";
import { createReservation } from "@/app/lib/data";
import { useRouter } from "next/navigation";
import { Reservation } from "@/app/types/reservation";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

interface Props {
  isOpen: boolean;
  room?: Room;
  date?: string;
  userId: number;
  startAt?: number;
  setModalController: React.Dispatch<React.SetStateAction<ModalController>>;
}

export interface NewReservation {
  roomId: number;
  userId: number;
  date: string;
  startAt: number;
  endAt: number;
  description: string;
}

export default function CreateNewReservationModal({
  isOpen,
  room,
  date,
  userId,
  setModalController,
  startAt = 0,
}: Props) {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const descriptionRef = useRef<string>("");

  async function handleSubmit() {
    const description = descriptionRef.current;
    const newReservation:NewReservation = {
      roomId: room?.id as number,
      userId: Number(userId),
      date: date as string,
      startAt: startAt,
      endAt: startAt + 1,
      description: description,
    }
    if (room && date) {
      createReservation(newReservation);
      //setModalController(ModalController.None);
      // ページをリロード
      window.location.reload();
      closeModal();
    }
  }

  function closeModal() {
    setModalIsOpen(false);
    setModalController(ModalController.None);
  }
  return (
    <Modal
      isOpen={modalIsOpen}
      style={customStyles}
      onRequestClose={closeModal}
    >
      <div className="w-80 text-left text-lg">
        <h1 className="text-left font-bold text-center m-4 text-xl">
          {room?.name}を予約
        </h1>
        <div>
          <div>
            <p>
              予約日：
              {date?.replaceAll("-", "/")}
            </p>
          </div>
          <div className="my-2">
            <p>
              予約時間：{startAt}:00-{startAt + 1}:00
            </p>
          </div>
          <div>
            <h3>説明（任意）</h3>
            <textarea
              className="resize-none w-full border-2 mt-4"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                descriptionRef.current = e.target.value;
              }}
            />
          </div>
          <div className="mt-8">
            <button
              className="mx-12 rounded-full w-28 border-blue-500 text-slate-500 border-2"
              onClick={closeModal}
            >
              キャンセル
            </button>
            <input
              className="rounded-full bg-blue-500 text-slate-50 font-bold w-28"
              type="submit"
              value="予約する"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
