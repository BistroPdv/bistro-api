-- AlterTable
ALTER TABLE "public"."CaixaMovimentacao" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."CaixaFechamento" (
    "id" TEXT NOT NULL,
    "totalMoment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalMethods" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalChange" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "CaixaFechamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CaixaFechamentoMethodPayment" (
    "id" TEXT NOT NULL,
    "methodPaymentId" TEXT NOT NULL,
    "caixaFechamentoId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "CaixaFechamentoMethodPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CaixaFechamentoMethodPayment" ADD CONSTRAINT "CaixaFechamentoMethodPayment_methodPaymentId_fkey" FOREIGN KEY ("methodPaymentId") REFERENCES "public"."PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaixaFechamentoMethodPayment" ADD CONSTRAINT "CaixaFechamentoMethodPayment_caixaFechamentoId_fkey" FOREIGN KEY ("caixaFechamentoId") REFERENCES "public"."CaixaFechamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
