-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),
    "restaurantCnpj" TEXT NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "restaurantCnpj" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pedidosId" TEXT,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_pedidosId_fkey" FOREIGN KEY ("pedidosId") REFERENCES "Pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
