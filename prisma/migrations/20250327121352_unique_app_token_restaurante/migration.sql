/*
  Warnings:

  - A unique constraint covering the columns `[appToken]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_appToken_key" ON "Restaurant"("appToken");
