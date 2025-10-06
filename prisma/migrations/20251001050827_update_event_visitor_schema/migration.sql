/*
  Warnings:

  - You are about to drop the column `userAgent` on the `Visitor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `browser` to the `Visitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "public"."Visitor" DROP COLUMN "userAgent",
ADD COLUMN     "browser" TEXT NOT NULL,
ADD COLUMN     "os" TEXT NOT NULL,
ADD CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "public"."Event"("id");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "public"."Event"("type");

-- CreateIndex
CREATE INDEX "Visitor_url_idx" ON "public"."Visitor"("url");
