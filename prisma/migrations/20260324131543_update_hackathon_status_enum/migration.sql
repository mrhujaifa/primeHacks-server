/*
  Warnings:

  - The values [ACTIVE,CLOSED] on the enum `HackathonStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HackathonStatus_new" AS ENUM ('DRAFT', 'ONGOING', 'UPCOMING', 'COMPLETED', 'ENDED');
ALTER TABLE "public"."Hackathon" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Hackathon" ALTER COLUMN "status" TYPE "HackathonStatus_new" USING ("status"::text::"HackathonStatus_new");
ALTER TYPE "HackathonStatus" RENAME TO "HackathonStatus_old";
ALTER TYPE "HackathonStatus_new" RENAME TO "HackathonStatus";
DROP TYPE "public"."HackathonStatus_old";
ALTER TABLE "Hackathon" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
