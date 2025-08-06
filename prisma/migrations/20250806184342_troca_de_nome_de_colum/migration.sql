/*
  Warnings:

  - You are about to drop the column `channel` on the `PaymentMethod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."PaymentMethod" DROP COLUMN "channel",
ADD COLUMN     "change" BOOLEAN DEFAULT false;
