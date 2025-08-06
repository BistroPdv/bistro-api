/*
  Warnings:

  - You are about to drop the column `nome` on the `PaymentMethod` table. All the data in the column will be lost.
  - Added the required column `name` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TipoPagamento" AS ENUM ('DINHEIRO', 'CARTAO', 'PIX', 'TICKET', 'VOUCHER', 'OUTROS');

-- AlterTable
ALTER TABLE "public"."PaymentMethod" DROP COLUMN "nome",
ADD COLUMN     "channel" BOOLEAN DEFAULT false,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "taxa" INTEGER DEFAULT 0,
ADD COLUMN     "type" "public"."TipoPagamento" NOT NULL;
