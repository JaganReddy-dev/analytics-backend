/*
  Warnings:

  - Added the required column `sessionId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sessionId` on the `PageView` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `PageView` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `sessionId` to the `Visitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "sessionId" UUID NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."PageView" DROP COLUMN "sessionId",
ADD COLUMN     "sessionId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."Visitor" ADD COLUMN     "sessionId" UUID NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL;
