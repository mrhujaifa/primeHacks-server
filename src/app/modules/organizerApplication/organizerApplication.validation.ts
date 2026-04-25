import { z } from "zod";
import { OrganizerApplicationStatus } from "../../../../prisma/generated/prisma/enums";

export const createOrganizerApplicationValidationSchema = z.object({
  organizationName: z
    .string("Organization name is required")
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must be less than 100 characters"),

  websiteUrl: z
    .string()
    .url("Website URL must be valid")
    .optional()
    .or(z.literal("")),

  contactEmail: z
    .string("Contact email is required")
    .email("Contact email must be valid"),

  previousExperience: z
    .string()
    .max(1000, "Previous experience must be less than 1000 characters")
    .optional()
    .or(z.literal("")),

  reason: z
    .string("Reason is required")
    .min(20, "Reason must be at least 20 characters")
    .max(1500, "Reason must be less than 1500 characters"),

  expectedHackathonType: z
    .enum([
      "ONLINE",
      "OFFLINE",
      "HYBRID",
      "COLLEGE_COMMUNITY",
      "STARTUP_INDUSTRY",
      "OTHER",
    ])
    .optional(),

  agreeToGuidelines: z.boolean().refine((value) => value === true, {
    message: "You must agree to the organizer guidelines",
  }),
});

export const reviewOrganizerApplicationValidationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),

  rejectionReason: z.string().optional(),
});
