import { Reservation } from "@/app/types/reservation";

// 会議室
export type Room = {
  id: number;
  name: string;
  Reservations?: Reservation[];
  createdAt?: Date;
  updatedAt?: Date;
};
