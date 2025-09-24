-- CreateEnum
CREATE TYPE "public"."TipoHistoryPedido" AS ENUM ('CREATED', 'UPDATED', 'DELIVERED', 'CANCELADO');

-- CreateTable
CREATE TABLE "public"."HistoryPedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "type" "public"."TipoHistoryPedido" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoryPedido_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."HistoryPedido" ADD CONSTRAINT "HistoryPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
