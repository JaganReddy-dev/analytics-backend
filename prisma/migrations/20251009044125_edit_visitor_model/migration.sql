/*
  Warnings:

  - You are about to drop the column `latlong` on the `Visitor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Visitor" DROP COLUMN "latlong",
ADD COLUMN     "lat" TEXT,
ADD COLUMN     "lon" TEXT;
