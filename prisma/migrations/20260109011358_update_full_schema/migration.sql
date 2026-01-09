/*
  Warnings:

  - You are about to drop the column `check_in_date` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `check_out_date` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `check_in` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `check_out` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guest_id` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "check_in_date",
DROP COLUMN "check_out_date",
DROP COLUMN "user_id",
ADD COLUMN     "check_in" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "check_out" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "guest_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
