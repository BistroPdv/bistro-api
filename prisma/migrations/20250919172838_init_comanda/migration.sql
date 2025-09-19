-- CreateEnum
CREATE TYPE "public"."StatusComanda" AS ENUM ('ABERTO', 'AGUARDANDO_PG', 'FECHADO');

-- AlterEnum
ALTER TYPE "public"."StatusPedido" ADD VALUE 'AGUARDANDO_PG';

-- AlterEnum
ALTER TYPE "public"."StatusProduto" ADD VALUE 'ENVIADO';

-- CreateTable
CREATE TABLE "public"."Comanda" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "status" "public"."StatusComanda" NOT NULL DEFAULT 'FECHADO',
    "restaurantCnpj" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comanda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Comanda" ADD CONSTRAINT "Comanda_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "public"."Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;
