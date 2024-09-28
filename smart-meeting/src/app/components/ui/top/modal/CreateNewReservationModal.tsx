import Modal from 'react-modal';
import React, { useState, useRef } from 'react';
import { Room } from '@/app/types/room';
import { InfoOfNewReservation, ModalController } from '@/app/page';
import { createReservation } from '@/app/lib/data';
import { useRouter } from 'next/navigation';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

interface Props {
  isOpen: boolean;
  room?: Room;
  date?: string;
  userId: string
  startAt?: number;
  setModalController: React.Dispatch<React.SetStateAction<ModalController>>;  
}

export default function CreateNewReservationModal({isOpen, room, date, userId, setModalController, startAt=0}: Props) {
  const [ modalIsOpen, setModalIsOpen ] = useState(isOpen);
  const descriptionRef = useRef<string>('');

 async function handleSubmit () {
    const description = descriptionRef.current;
    if (room && date) {
      createReservation(room.id, userId, date, startAt, description as string);
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
    <Modal isOpen={modalIsOpen} style={customStyles} onRequestClose={closeModal}>
      <h2>{room?.name}を予約</h2>
      <div>
        <div>
        <h3>予約日</h3>
        <p>{date}</p>
        </div>
        <div>
          <h3>予約時間</h3>
          <p>{startAt}:00-{startAt + 1}:00</p>
        </div>
        <div>
          <h3>説明（任意）</h3>
          <textarea onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> {
            descriptionRef.current = e.target.value;
          } } />
        </div>
        <div>
          <button onClick={closeModal}>キャンセル</button>
        <input type='submit' value="予約する" onClick={handleSubmit}/>
        </div>
      </div>
    </Modal>
  )
}
