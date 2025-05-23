-- CreateTable
CREATE TABLE "PedidoProdutoAdicional" (
    "id" TEXT NOT NULL,
    "pedidoProdutoId" TEXT NOT NULL,
    "adicionalId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "PedidoProdutoAdicional_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PedidoProdutoAdicional" ADD CONSTRAINT "PedidoProdutoAdicional_adicionalId_fkey" FOREIGN KEY ("adicionalId") REFERENCES "AdicionalOptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoProdutoAdicional" ADD CONSTRAINT "PedidoProdutoAdicional_pedidoProdutoId_fkey" FOREIGN KEY ("pedidoProdutoId") REFERENCES "PedidoProduto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
