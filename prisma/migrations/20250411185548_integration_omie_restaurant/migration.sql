/*
  Warnings:

  - You are about to drop the column `userRestaurantId` on the `IntegrationOmie` table. All the data in the column will be lost.
  - You are about to drop the column `pdvIntegrations` on the `UserRestaurant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[restaurantId]` on the table `IntegrationOmie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `restaurantId` to the `IntegrationOmie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IntegrationOmie" DROP CONSTRAINT "IntegrationOmie_userRestaurantId_fkey";

-- DropIndex
DROP INDEX "IntegrationOmie_userRestaurantId_key";

-- AlterTable
ALTER TABLE "IntegrationOmie" DROP COLUMN "userRestaurantId",
ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "pdvIntegrations" "Integrations";

-- AlterTable
ALTER TABLE "UserRestaurant" DROP COLUMN "pdvIntegrations";

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationOmie_restaurantId_key" ON "IntegrationOmie"("restaurantId");

-- AddForeignKey
ALTER TABLE "IntegrationOmie" ADD CONSTRAINT "IntegrationOmie_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;
