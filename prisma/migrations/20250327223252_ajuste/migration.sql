-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "imagem" DROP NOT NULL,
ALTER COLUMN "cor" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "logo" TEXT;
