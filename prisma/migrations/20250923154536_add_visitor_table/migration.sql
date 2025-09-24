-- CreateTable
CREATE TABLE "public"."Visitor" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "referrer" TEXT NOT NULL,
    "screenWidth" TEXT NOT NULL,
    "screenHeight" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_id_key" ON "public"."Visitor"("id");
