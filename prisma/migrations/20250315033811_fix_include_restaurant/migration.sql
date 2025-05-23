/*
  Warnings:

  - Added the required column `restaurantCnpj` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantCnpj` to the `Mesa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantCnpj` to the `Pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "restaurantCnpj" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Mesa" ADD COLUMN     "restaurantCnpj" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PedidoProduto" ADD COLUMN     "externoId" TEXT;

-- AlterTable
ALTER TABLE "Pedidos" ADD COLUMN     "restaurantCnpj" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Mesa" ADD CONSTRAINT "Mesa_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;
