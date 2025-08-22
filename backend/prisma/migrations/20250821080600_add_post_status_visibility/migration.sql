-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "visibility" "public"."Visibility" NOT NULL DEFAULT 'PRIVATE';
