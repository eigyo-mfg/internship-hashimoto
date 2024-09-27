import { Reservation } from "@/app/types/reservation";

export type SelectedReservation = {
    isNew: boolean;
    reservation: Reservation;
}