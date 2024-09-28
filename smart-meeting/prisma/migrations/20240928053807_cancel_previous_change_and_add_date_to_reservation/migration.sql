/*
  Warnings:

  - Added the required column `date` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `startAt` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endAt` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "date" TEXT NOT NULL,
DROP COLUMN "startAt",
ADD COLUMN     "startAt" INTEGER NOT NULL,
DROP COLUMN "endAt",
ADD COLUMN     "endAt" INTEGER NOT NULL;
