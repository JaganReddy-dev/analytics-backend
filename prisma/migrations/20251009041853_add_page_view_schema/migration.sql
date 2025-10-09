/*
  Warnings:

  - Added the required column `latlong` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Visitor" ADD COLUMN     "latlong" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."PageView" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "location" TEXT,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageView_id_key" ON "public"."PageView"("id");

-- CreateIndex
CREATE INDEX "PageView_url_idx" ON "public"."PageView"("url");
