import { Room } from '@/app/types/room';
import React, {useState} from 'react'
import  ReservationList  from '@/app/components/ui/top/ReservationList';

interface Props {
    rooms: Room[];
    setSelectedReservation: React.Dispatch<React.SetStateAction<string>>;
  }

export default function ReservationPagination({ rooms ,setSelectedReservation }: Props) {
    const perPage = 5;
    let totalPage = Math.ceil(rooms.length / perPage) + 1;
    const [currentPage, setCurrentPage] = useState(0);
    
    return (
        <div className='flex'>
            <button className="text-lg">{"<"}</button>
            {/* ReservationListに、roomsのperPage * roomsのcurrentPageからperPage* rooms + perPage-1だけ渡す */}
            <ReservationList rooms={rooms.slice(perPage * currentPage, perPage * currentPage + perPage)} setSelectedReservation={setSelectedReservation} />
            <button className="text-lg">{">"}</button>
        </div>
    )
}
                    