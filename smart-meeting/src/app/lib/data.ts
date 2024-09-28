'use server'

import prisma from "@/app/lib/prisma";
import { User } from "@/app/types/user";
import { Room } from "@/app/types/room";

export async function getPassword(userId: string) {
  const data = await prisma.user.findUnique({
    select: {
      password: true,
    },
    where: {
      id: parseInt(userId),
    },
  });
  if (!data) {
    return null;
  }
  return data.password;
}

export async function getUser(userId: string) {
  const data = await prisma.user.findUnique({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      privilege: true,
    },
    where: {
      id: parseInt(userId),
    },
  });
  if (!data) {
    return null;
  }
  const user: User = {
    id: data.id.toString(),
    firstName: data.firstName,
    lastName: data.lastName,
    privilege: data.privilege,
  };
  return user;
}

export async function getRoomsWithReservationByDate(date: string) {
  
  const data = await prisma.room.findMany({
    select: {
      id: true,
      name: true,
      Reservations: {
        select: {
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

  const rooms: Room[] = data.map((room) => {
    return {
      id: room.id.toString(),
      name: room.name,
      Reservations: room.Reservations.map((reservation) => {
        return {
          id: reservation.id.toString(),
          startAt: reservation.startAt,
          endAt: reservation.endAt,
          userId: reservation.userId.toString(),
          roomId: room.id.toString(),
          description: reservation.description,
          user: {
            id: reservation.user.id.toString(),
            firstName: reservation.user.firstName,
            lastName: reservation.user.lastName,
          },
        };
      }),
    };
  });
  return rooms;
}

export async function createReservation(roomId: string, userId: string, date: string, startAt: number, description: string) {
  const data = await prisma.reservation.create({
    data: {
      startAt: startAt,
      endAt: startAt + 1,
      date: date,
      userId: parseInt(userId),
      roomId: parseInt(roomId),
      description: description,
    },
  });
  return data;
}

export async function deleteReservation(reservationId: string) {
  const data = await prisma.reservation.delete({
    where: {
      id: parseInt(reservationId),
    },
  });
  return data;
}