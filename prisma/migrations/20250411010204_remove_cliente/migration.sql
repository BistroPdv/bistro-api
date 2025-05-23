/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Pedidos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pedidos" DROP CONSTRAINT "Pedidos_clienteId_fkey";

-- AlterTable
ALTER TABLE "Pedidos" DROP COLUMN "clienteId";
