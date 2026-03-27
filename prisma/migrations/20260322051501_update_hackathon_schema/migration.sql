-- AlterTable
ALTER TABLE "Hackathon" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "discordUrl" TEXT,
ADD COLUMN     "eligibility" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "registrationEndDate" TIMESTAMP(3),
ADD COLUMN     "registrationStartDate" TIMESTAMP(3),
ADD COLUMN     "rules" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "websiteUrl" TEXT,
ALTER COLUMN "currency" SET DEFAULT 'USDT';

-- CreateIndex
CREATE INDEX "Hackathon_submissionDeadline_idx" ON "Hackathon"("submissionDeadline");
