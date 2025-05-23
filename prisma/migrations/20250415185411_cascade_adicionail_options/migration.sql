-- DropForeignKey
ALTER TABLE "AdicionalHeader" DROP CONSTRAINT "AdicionalHeader_categoriaId_fkey";

-- AddForeignKey
ALTER TABLE "AdicionalHeader" ADD CONSTRAINT "AdicionalHeader_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
