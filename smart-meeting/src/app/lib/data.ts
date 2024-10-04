"use server";

import prisma from "@/app/lib/prisma";
import { User } from "@/app/types/user";
import { Room } from "@/app/types/room";
import { Reservation } from "@prisma/client";
import { NewReservation } from "@/app/components/ui/top/modal/CreateNewReservationModal";
// ユーザーIDからパスワードを取得
export async function getPassword(userId: number) {
  const data = await prisma.user.findUnique({
    select: {
      password: true,
    },
    where: {
      id: userId,
    },
  });
  if (!data) {
    return null;
  }
  return data.password;
}

// ユーザー情報を取得
export async function getUser(userId: number) {
  const data:User | null = await prisma.user.findUnique({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      privilege: true,
    },
    where: {
      id: userId,
    },
  });
  if (!data) {
    return null;
  }
  return data;
}

// 日付を指定して予約情報を取得
export async function getRoomsWithReservationByDate(date: string) {
  const data: Room[] = await prisma.room.findMany({
    select: {
      id: true,
      name: true,
      Reservations: {
        select: {
          roomId: true,
          id: true,
          date: true,
          startAt: true,
          endAt: true,
          userId: true,
          description: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        where: {
          date: date,
        },
        orderBy: {
          startAt: "asc",
        },
      },
    },
  });
  
  return data;
}

// 予約を作成
export async function createReservation(
  // roomId: string,
  // userId: string,
  // date: string,
  // startAt: number,
  // description: string,
  reservation: NewReservation
) {
  const data = await prisma.reservation.create({
    data: {
      startAt: reservation.startAt,
      endAt: reservation.endAt,
      date: reservation.date,
      userId: reservation.userId,
      roomId: reservation.roomId,
      description: reservation.description,
    },
  });
  return data;
}

// 予約を削除
export async function deleteReservation(reservationId: number) {
  const data = await prisma.reservation.delete({
    where: {
      id: reservationId,
    },
  });
  return data;
}
