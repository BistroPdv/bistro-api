/*
  Warnings:

  - A unique constraint covering the columns `[pedidoProdutoId,adicionalId]` on the table `PedidoProdutoAdicional` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `preco` to the `PedidoProdutoAdicional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PedidoProdutoAdicional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PedidoProdutoAdicional" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "preco" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PedidoProdutoAdicional_pedidoProdutoId_adicionalId_key" ON "PedidoProdutoAdicional"("pedidoProdutoId", "adicionalId");
