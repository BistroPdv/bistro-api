-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "impressoraId" TEXT;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_impressoraId_fkey" FOREIGN KEY ("impressoraId") REFERENCES "Impressora"("id") ON DELETE SET NULL ON UPDATE CASCADE;
