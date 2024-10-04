import { User } from "@/app/types/user";

// 予約情報
export type Reservation = {
  id: number;
  userId: number;
  roomId: number;
  startAt: number;
  date: string;
  endAt: number;
  description: string | null;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
};
