-- DropForeignKey
ALTER TABLE "Pedidos" DROP CONSTRAINT "Pedidos_mesaId_fkey";

-- AlterTable
ALTER TABLE "Pedidos" ALTER COLUMN "mesaId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "Mesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
