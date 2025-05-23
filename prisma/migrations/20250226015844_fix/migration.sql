/*
  Warnings:

  - A unique constraint covering the columns `[restaurantCnpj]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[restaurantCnpj]` on the table `Impressora` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[restaurantCnpj]` on the table `Produto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `restaurantCnpj` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantCnpj` to the `Impressora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantCnpj` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "restaurantCnpj" TEXT NOT NULL,
ALTER COLUMN "temPromocao" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Impressora" ADD COLUMN     "restaurantCnpj" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "restaurantCnpj" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserRestaurant" ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Filial" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT,
    "restaurantCnpj" TEXT NOT NULL,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Filial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Filial_cnpj_key" ON "Filial"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Filial_restaurantCnpj_key" ON "Filial"("restaurantCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_restaurantCnpj_key" ON "Categoria"("restaurantCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Impressora_restaurantCnpj_key" ON "Impressora"("restaurantCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_restaurantCnpj_key" ON "Produto"("restaurantCnpj");

-- AddForeignKey
ALTER TABLE "Filial" ADD CONSTRAINT "Filial_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impressora" ADD CONSTRAINT "Impressora_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;
