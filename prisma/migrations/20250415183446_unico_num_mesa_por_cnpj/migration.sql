/*
  Warnings:

  - A unique constraint covering the columns `[numero,restaurantCnpj]` on the table `Mesa` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Impressora_restaurantCnpj_key";

-- CreateIndex
CREATE UNIQUE INDEX "Mesa_numero_restaurantCnpj_key" ON "Mesa"("numero", "restaurantCnpj");
