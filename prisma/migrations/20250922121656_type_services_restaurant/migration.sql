-- CreateEnum
CREATE TYPE "public"."TypeService" AS ENUM ('TABLE', 'TABLE_COMMANDED', 'COMMANDED');

-- AlterTable
ALTER TABLE "public"."Restaurant" ADD COLUMN     "typeService" "public"."TypeService" NOT NULL DEFAULT 'TABLE';
