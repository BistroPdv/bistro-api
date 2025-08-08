/*
  Warnings:

  - You are about to drop the column `indoPagamento` on the `Pedidos` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TipoPedido" AS ENUM ('COUNTER', 'DELIVERY', 'INDOOR');

-- DropForeignKey
ALTER TABLE "public"."Pedidos" DROP CONSTRAINT "Pedidos_mesaId_fkey";

-- AlterTable
ALTER TABLE "public"."Pedidos" DROP COLUMN "indoPagamento",
ADD COLUMN     "tipoPedido" "public"."TipoPedido" DEFAULT 'COUNTER',
ALTER COLUMN "mesaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Pedidos" ADD CONSTRAINT "Pedidos_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "public"."Mesa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
