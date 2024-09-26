"use server";

import prisma from "@/app/lib/prisma";
import { User } from "@/app/types/user";
import { LoginData } from "../types/loginData";

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

export async function getUserToLogin(userId: string) {
  const loginData: LoginData | null = await prisma.user.findUnique({
    select: {
      id: true,
      password: true,
    },
    where: {
      id: parseInt(userId),
    },
  });
  return loginData;
}
