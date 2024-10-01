import Modal from 'react-modal';
import React, { useState, useRef } from 'react';
import { Room } from '@/app/types/room';
import { InfoOfNewReservation, ModalController } from '@/app/page';
import { createReservation, deleteReservation } from '@/app/lib/data';
import { useRouter } from 'next/navigation';
import { Reservation } from '@/app/types/reservation';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};
interface Props {
  isOpen: boolean;
  roomName?: string;
  reservation?: Reservation;
  date?: string;
  userId: string
  setModalController: React.Dispatch<React.SetStateAction<ModalController>>;
  startAt?: number;
}

export default function EditReservation({reservation,isOpen, roomName, date, userId, setModalController, startAt=0}: Props) {
  const [ modalIsOpen, setModalIsOpen ] = useState(isOpen);

 async function handleSubmit () {
    if (roomName && date) {
      await deleteReservation(reservation?.id as string);
      setModalController(ModalController.None);
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
    <Modal isOpen={modalIsOpen} style={customStyles} onRequestClose={closeModal}>
      <div className='w-80 text-left text-lg'>
      <h1 className='text-left font-bold text-center m-4 text-xl'>{roomName}を予約</h1>
      <div>
        <div>
<p>予約日：{date?.replaceAll('-', '/')}</p>
        </div>
        <div className='my-2'>
          <p>予約時間：{startAt}:00-{startAt + 1}:00</p>
        </div>
        <div>
          <p>{reservation?.userId === userId ? "あなた" : reservation?.user?.lastName + "さん"}が予約しています</p>
          {reservation?.description && <p>説明：<br />{reservation?.description}</p>}
        </div>
        <div className='text-center mt-8'>
          {userId === reservation?.userId &&
        <input type='submit' value="削除する" className='rounded-full bg-red-500 text-white w-24' onClick={handleSubmit} />
      }
        </div>
      </div>
      </div>
    </Modal>
  )
}
