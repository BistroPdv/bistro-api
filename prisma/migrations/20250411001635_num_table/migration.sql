/*
  Warnings:

  - Changed the type of `mesaId` on the `Pedidos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Pedidos" DROP CONSTRAINT "Pedidos_mesaId_fkey";

-- AlterTable
ALTER TABLE "Pedidos" DROP COLUMN "mesaId",
ADD COLUMN     "mesaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "Mesa"("numero") ON DELETE RESTRICT ON UPDATE CASCADE;
