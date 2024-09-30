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
    width: '400px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
      <div className='w-80 text-left text-lg'>
      <h1 className='text-left font-bold text-center m-4 text-xl'>{room?.name}を予約</h1>
      <div>
        <div>
        <p>予約日：
     {date?.replaceAll('-', '/')}</p>
        </div>
        <div className='my-2'>

          <p>予約時間：{startAt}:00-{startAt + 1}:00</p>
        </div>
        <div>
          <h3>説明（任意）</h3>
          <textarea className='resize-none w-full border-2 mt-4' onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> {
            descriptionRef.current = e.target.value;
          } } />
        </div>
        <div className='mt-8'>
          <button className='mx-16' onClick={closeModal}>キャンセル</button>
        <input className='text-teal-600 font-bold' type='submit' value="予約する" onClick={handleSubmit}/>
        </div>
      </div>
      </div>
    </Modal>
  )
}
