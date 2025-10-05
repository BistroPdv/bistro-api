/*
  Warnings:

  - You are about to drop the column `printerServerId` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Restaurant" DROP COLUMN "printerServerId",
ADD COLUMN     "printerServerPort" INTEGER DEFAULT 5572,
ADD COLUMN     "printerServerToken" TEXT,
ADD COLUMN     "printerServerUrl" TEXT;
