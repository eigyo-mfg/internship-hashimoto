import { User } from '@/app/types/user';

export type Reservation = {
  id: string;
  userId: string;
  roomId: string;
  startAt: number;
  endAt: number;
  description: string | null;
  user?: User;
};
