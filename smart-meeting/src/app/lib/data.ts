'use server'

import prisma from "@/app/lib/prisma";
import { User } from "@/app/types/user";
import { Room } from "../types/room";

export async function getUser(userId: string) {
  const data = await prisma.user.findUnique({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      privilege: true,
      password: true,
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
    password: data.password,
  };
  return user;
}

export async function getRoomsWithReservationByDateSpan(startDate: number, endDate: number) {
  const data = await prisma.room.findMany({
    select: {
      id: true,
      name: true,
      Reservations: {
        select: {
          id: true,
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
          AND: [
            {
              startAt: {
                lte: startDate,
              },
            },
            {
              endAt: {
                gte: endDate,
              },
            },
          ],
        },
        orderBy: {
          startAt: "asc",
        },
      },
    },
  });
  console.log(data);
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
