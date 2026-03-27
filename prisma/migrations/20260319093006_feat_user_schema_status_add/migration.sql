-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('BLOCK', 'SUSPENDED', 'ACTIVE');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
