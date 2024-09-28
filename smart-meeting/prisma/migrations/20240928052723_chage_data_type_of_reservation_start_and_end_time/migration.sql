/*
  Warnings:

  - Changed the type of `startAt` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endAt` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "startAt",
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endAt",
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL;
