import { ExpectedHackathonType } from "../../../../prisma/generated/prisma/enums";

export type TCreateOrganizerApplicationPayload = {
  organizationName: string;
  websiteUrl?: string;
  contactEmail: string;
  previousExperience?: string;
  reason: string;
  expectedHackathonType?: ExpectedHackathonType;
  agreeToGuidelines: boolean;
};

export type TReviewOrganizerApplicationPayload = {
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
};
