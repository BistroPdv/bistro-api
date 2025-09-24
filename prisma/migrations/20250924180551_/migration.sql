-- AlterTable
ALTER TABLE "public"."HistoryPedido" ADD COLUMN     "mesaId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."HistoryPedido" ADD CONSTRAINT "HistoryPedido_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "public"."Mesa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
