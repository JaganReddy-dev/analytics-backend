-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_website_idx" ON "public"."Event"("website");
