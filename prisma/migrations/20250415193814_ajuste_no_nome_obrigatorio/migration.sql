/*
  Warnings:

  - You are about to drop the column `obrigadorio` on the `AdicionalHeader` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdicionalHeader" DROP COLUMN "obrigadorio",
ADD COLUMN     "obrigatorio" BOOLEAN NOT NULL DEFAULT false;
