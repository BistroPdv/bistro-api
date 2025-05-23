-- CreateEnum
CREATE TYPE "Integrations" AS ENUM ('OMIE');

-- AlterTable
ALTER TABLE "UserRestaurant" ADD COLUMN     "pdvIntegrations" "Integrations";

-- CreateTable
CREATE TABLE "IntegrationOmie" (
    "id" TEXT NOT NULL,
    "omie_key" TEXT NOT NULL,
    "omie_secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userRestaurantId" TEXT NOT NULL,

    CONSTRAINT "IntegrationOmie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationOmie_userRestaurantId_key" ON "IntegrationOmie"("userRestaurantId");

-- AddForeignKey
ALTER TABLE "IntegrationOmie" ADD CONSTRAINT "IntegrationOmie_userRestaurantId_fkey" FOREIGN KEY ("userRestaurantId") REFERENCES "UserRestaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
