/*
  Warnings:

  - Added the required column `restaurantCnpj` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "restaurantCnpj" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_restaurantCnpj_fkey" FOREIGN KEY ("restaurantCnpj") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;
