/*
  Warnings:

  - Added the required column `nightly_price` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SCAM', 'WRONG_INFO', 'OFFENSIVE', 'DAMAGED_PROPERTY', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'PROCESSING', 'RESOLVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'REFUNDED';

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';

-- AlterEnum
ALTER TYPE "PropertyStatus" ADD VALUE 'MAINTENANCE';

-- AlterTable
ALTER TABLE "amenities" ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "cleaning_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "guest_count" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "nightly_price" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "service_fee" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "cleaning_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "location_id" INTEGER,
ADD COLUMN     "max_guests" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "num_bathrooms" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "num_bedrooms" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "num_beds" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "accuracy" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "check_in_rating" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "cleanliness" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "value" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_calendar" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "custom_price" DECIMAL(10,2),

    CONSTRAINT "property_calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "reason" "ReportReason" NOT NULL DEFAULT 'OTHER',
    "description" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "images" TEXT[],
    "reporter_id" INTEGER NOT NULL,
    "target_property_id" INTEGER,
    "target_booking_id" INTEGER,
    "target_user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "property_calendar_property_id_date_key" ON "property_calendar"("property_id", "date");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_calendar" ADD CONSTRAINT "property_calendar_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_target_property_id_fkey" FOREIGN KEY ("target_property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_target_booking_id_fkey" FOREIGN KEY ("target_booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
