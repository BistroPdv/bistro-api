/*
  Warnings:

  - A unique constraint covering the columns `[username,restaurantCnpj,delete]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_username_restaurantCnpj_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_restaurantCnpj_delete_key" ON "User"("username", "restaurantCnpj", "delete");
