/*
  Warnings:

  - You are about to drop the column `caminho` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `modelo` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `quantidadeDeColunas` on the `Impressora` table. All the data in the column will be lost.
  - You are about to drop the column `quantidadeDeVias` on the `Impressora` table. All the data in the column will be lost.
  - Added the required column `impressoraId` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `porta` to the `Impressora` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Impressora" DROP CONSTRAINT "Impressora_categoriaId_fkey";

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN "impressoraId" TEXT;

-- AlterTable
ALTER TABLE "Impressora" DROP COLUMN "caminho",
DROP COLUMN "categoriaId",
DROP COLUMN "modelo",
DROP COLUMN "quantidadeDeColunas",
DROP COLUMN "quantidadeDeVias",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "porta" INTEGER NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_impressoraId_fkey" FOREIGN KEY ("impressoraId") REFERENCES "Impressora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
