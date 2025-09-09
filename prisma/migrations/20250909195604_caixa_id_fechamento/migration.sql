/*
  Warnings:

  - A unique constraint covering the columns `[caixaId]` on the table `CaixaFechamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[caixaId,id]` on the table `CaixaFechamento` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."CaixaFechamento" ADD COLUMN     "caixaId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CaixaFechamento_caixaId_key" ON "public"."CaixaFechamento"("caixaId");

-- CreateIndex
CREATE INDEX "CaixaFechamento_caixaId_idx" ON "public"."CaixaFechamento"("caixaId");

-- CreateIndex
CREATE UNIQUE INDEX "CaixaFechamento_caixaId_id_key" ON "public"."CaixaFechamento"("caixaId", "id");

-- AddForeignKey
ALTER TABLE "public"."CaixaFechamento" ADD CONSTRAINT "CaixaFechamento_caixaId_fkey" FOREIGN KEY ("caixaId") REFERENCES "public"."Caixa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
