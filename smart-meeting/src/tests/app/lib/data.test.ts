import { getPassword, getUser, getRoomsWithReservationByDate, createReservation, deleteReservation } from "@/app/lib/data"; 
import prisma from "@/app/lib/prisma";
import { create } from "domain";

// モックを初期化
jest.mock("@/app/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
    room: {
      findMany: jest.fn(),
    },
    reservation: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockUsers = [
  {
    id: 1,
    firstName: "Test",
    lastName: "User",
    privilege: "admin",
    password: "testpassword",
  },
  {
    id: 2,
    firstName: "Test",
    lastName: "User",
    privilege: "user",
    password: "testpassword",
  },
];

const mockReservations = [
  {
    id: 1,
    startAt: 9,
    endAt: 10,
    date: "2024-10-05",
    userId: 1,
    roomId: 1,
    description: "Meeting",
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUsers[0],
  },
  {
    id: 2,
    startAt: 11,
    endAt: 12,
    date: "2024-10-05",
    userId: 2,
    roomId: 2,
    description: "Meeting",
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUsers[1],
  }
];


const mockRoomWithReservations = {
  id: 1,
  name: "Room 1",
  Reservations: mockReservations,
};


describe("getPassword", () => {
  it("ユーザーが存在する場合、パスワードを返す", async () => {
    const expected = "testpassword";
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUsers[0]);

    const password = await getPassword(1);
    expect(password).toBe(expected);
  });

  it("ユーザーが存在しない場合、パスワードはnull", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    const password = await getPassword(1);
    expect(password).toBeNull();
  });
});

describe("getUser", () => {
  it("ユーザーが存在する場合、ユーザー情報を返す", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUsers[0]);

    const user = await getUser(1);
    expect(user).toEqual(mockUsers[0]);
  });

  it("ユーザーが存在しない場合、nullを返す", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const user = await getUser(1);
    expect(user).toBeNull();
  });
});

describe("getRoomsWithReservationByDate", () => {
  it("該当する日付の会議室情報を予約情報とともに返す", async () => {

    (prisma.room.findMany as jest.Mock).mockResolvedValueOnce([mockRoomWithReservations]);

    const rooms = await getRoomsWithReservationByDate("2024-10-05");
    expect(rooms).toEqual([mockRoomWithReservations]);
  });
  it("該当する日付の会議室情報が存在しない場合、空の配列を返す", async () => {
    (prisma.room.findMany as jest.Mock).mockResolvedValueOnce([]);

    const rooms = await getRoomsWithReservationByDate("2024-10-05");
    expect(rooms).toEqual([]);
  }
  );
});

describe("createReservation", () => {
  it("新しい予約情報を返す", async () => {
    (prisma.reservation.create as jest.Mock).mockResolvedValueOnce(mockReservations[0]);

    const reservation = await createReservation({
      roomId: 1,
      userId: 1,
      date: "2024-10-05",
      startAt: 9,
      endAt: 10,
      description: "Meeting",
    });
    expect(reservation).toEqual(mockReservations[0]);
  });
});

const mockedReservation = {
  id: 1,
  userId: 1,
  roomId: 1,
  date: "2024-10-05",
  startAt: 9,
  endAt: 10,
  description: "Meeting",
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("deleteReservation", () => {
  it("消去された予約情報を返す", async () => {
    (prisma.reservation.delete as jest.Mock).mockResolvedValueOnce(mockedReservation);

    const reservation = await deleteReservation(1);
    expect(reservation).toEqual(mockedReservation);
  });
});