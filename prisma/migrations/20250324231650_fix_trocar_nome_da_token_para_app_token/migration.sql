/*
  Warnings:

  - You are about to drop the column `token` on the `Restaurant` table. All the data in the column will be lost.
  - The required column `appToken` was added to the `Restaurant` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "token",
ADD COLUMN     "appToken" TEXT NOT NULL;
