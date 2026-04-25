-- CreateEnum
CREATE TYPE "OrganizerApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ExpectedHackathonType" AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID', 'COLLEGE_COMMUNITY', 'STARTUP_INDUSTRY', 'OTHER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "organizerApplicationStatus" "OrganizerApplicationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "organizer_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "contactEmail" TEXT NOT NULL,
    "previousExperience" TEXT,
    "reason" TEXT NOT NULL,
    "expectedHackathonType" TEXT,
    "agreeToGuidelines" BOOLEAN NOT NULL DEFAULT false,
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizer_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "organizer_applications_userId_idx" ON "organizer_applications"("userId");

-- AddForeignKey
ALTER TABLE "organizer_applications" ADD CONSTRAINT "organizer_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
