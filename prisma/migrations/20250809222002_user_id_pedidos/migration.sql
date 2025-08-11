-- AlterTable
ALTER TABLE "public"."Pedidos" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Pedidos" ADD CONSTRAINT "Pedidos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
