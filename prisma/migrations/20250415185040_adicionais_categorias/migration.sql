-- AlterTable
ALTER TABLE "Categoria" ALTER COLUMN "ordem" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "AdicionalHeader" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "qtdMinima" INTEGER DEFAULT 1,
    "qtdMaxima" INTEGER DEFAULT 1,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),
    "categoriaId" TEXT,

    CONSTRAINT "AdicionalHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdicionalOptions" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "codIntegra" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),
    "adicionalHeaderId" TEXT,

    CONSTRAINT "AdicionalOptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdicionalHeader" ADD CONSTRAINT "AdicionalHeader_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdicionalOptions" ADD CONSTRAINT "AdicionalOptions_adicionalHeaderId_fkey" FOREIGN KEY ("adicionalHeaderId") REFERENCES "AdicionalHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;
