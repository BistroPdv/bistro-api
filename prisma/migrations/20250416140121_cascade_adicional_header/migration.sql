-- DropForeignKey
ALTER TABLE "AdicionalOptions" DROP CONSTRAINT "AdicionalOptions_adicionalHeaderId_fkey";

-- AddForeignKey
ALTER TABLE "AdicionalOptions" ADD CONSTRAINT "AdicionalOptions_adicionalHeaderId_fkey" FOREIGN KEY ("adicionalHeaderId") REFERENCES "AdicionalHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;
