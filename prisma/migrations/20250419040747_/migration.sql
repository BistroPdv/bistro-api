/*
  Warnings:

  - You are about to drop the column `printerBill` on the `UserRestaurant` table. All the data in the column will be lost.
  - You are about to drop the column `printerNotification` on the `UserRestaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "printerBill" TEXT,
ADD COLUMN     "printerNotification" TEXT;

-- AlterTable
ALTER TABLE "UserRestaurant" DROP COLUMN "printerBill",
DROP COLUMN "printerNotification";
