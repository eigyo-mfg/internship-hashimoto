export type Reservation = {
  id: string;
  userId: string;
  roomId: string;
  startAt: string;
  endAt: string;
  description: string | null;
};
