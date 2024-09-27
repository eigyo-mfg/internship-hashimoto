import { Reservation } from "@/app/types/reservation";

export type Room = {
  id: string;
  name: string;
  Reservations?: Reservation[];
};
