/*
  Warnings:

  - You are about to drop the column `impressoraId` on the `Categoria` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_impressoraId_fkey";

-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "impressoraId";
