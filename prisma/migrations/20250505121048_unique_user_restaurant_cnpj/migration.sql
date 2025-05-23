/*
  Warnings:

  - A unique constraint covering the columns `[username,restaurantCnpj]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `restaurantCnpj` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_restaurantCnpj_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "restaurantCnpj" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_restaurantCnpj_key" ON "User"("username", "restaurantCnpj");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;