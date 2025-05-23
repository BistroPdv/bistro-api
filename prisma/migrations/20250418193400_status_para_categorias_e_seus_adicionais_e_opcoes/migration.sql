-- AlterTable
ALTER TABLE "AdicionalHeader" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "AdicionalOptions" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;
