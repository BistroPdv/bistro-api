/*
  Warnings:

  - You are about to drop the `UserRestaurant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRestaurant" DROP CONSTRAINT "UserRestaurant_restaurantCnpj_fkey";

-- DropForeignKey
ALTER TABLE "UserRestaurant" DROP CONSTRAINT "UserRestaurant_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "restaurantCnpj" TEXT;

-- DropTable
DROP TABLE "UserRestaurant";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE SET NULL ON UPDATE CASCADE;
