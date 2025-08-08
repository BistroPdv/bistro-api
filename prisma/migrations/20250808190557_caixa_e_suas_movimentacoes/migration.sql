-- CreateEnum
CREATE TYPE "public"."TipoMovimentacao" AS ENUM ('ABERTURA', 'SANGRIA', 'ENTRADA', 'SAIDA');

-- AlterTable
ALTER TABLE "public"."Pedidos" ADD COLUMN     "caixaId" TEXT,
ADD COLUMN     "idPdv" TEXT;

-- CreateTable
CREATE TABLE "public"."Caixa" (
    "id" TEXT NOT NULL,
    "restaurantCnpj" TEXT NOT NULL,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Caixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CaixaMovimentacao" (
    "id" TEXT NOT NULL,
    "caixaId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" "public"."TipoMovimentacao" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "CaixaMovimentacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Caixa" ADD CONSTRAINT "Caixa_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "public"."Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaixaMovimentacao" ADD CONSTRAINT "CaixaMovimentacao_caixaId_fkey" FOREIGN KEY ("caixaId") REFERENCES "public"."Caixa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedidos" ADD CONSTRAINT "Pedidos_caixaId_fkey" FOREIGN KEY ("caixaId") REFERENCES "public"."Caixa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
