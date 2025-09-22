/*
  Warnings:

  - You are about to drop the column `status` on the `Comanda` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Comanda" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "public"."PedidoProduto" ADD COLUMN     "commandedId" TEXT,
ADD COLUMN     "mesaId" TEXT;

-- AlterTable
ALTER TABLE "public"."Pedidos" ADD COLUMN     "comandaId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Pedidos" ADD CONSTRAINT "Pedidos_comandaId_fkey" FOREIGN KEY ("comandaId") REFERENCES "public"."Comanda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PedidoProduto" ADD CONSTRAINT "PedidoProduto_commandedId_fkey" FOREIGN KEY ("commandedId") REFERENCES "public"."Comanda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PedidoProduto" ADD CONSTRAINT "PedidoProduto_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "public"."Mesa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
