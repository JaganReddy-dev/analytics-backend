/*
  Warnings:

  - Changed the type of `screenWidth` on the `Visitor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `screenHeight` on the `Visitor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Visitor" DROP COLUMN "screenWidth",
ADD COLUMN     "screenWidth" INTEGER NOT NULL,
DROP COLUMN "screenHeight",
ADD COLUMN     "screenHeight" INTEGER NOT NULL;
