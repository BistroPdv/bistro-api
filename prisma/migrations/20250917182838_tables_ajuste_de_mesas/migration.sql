-- AlterTable
ALTER TABLE "public"."Mesa" ADD COLUMN     "group" TEXT,
ADD COLUMN     "inUse" INTEGER DEFAULT 0;
