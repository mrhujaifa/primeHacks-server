import { z } from "zod";

export const createHackathonSchema = z.object({
  title: z.string().min(3, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  categoryId: z.string().min(1, "Category is required"),
  submissionDeadline: z.string().min(1, "Submission deadline is required"),

  logoUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  discordUrl: z.string().optional(),
  contactEmail: z.string().optional(),

  rules: z.string().optional(),
  eligibility: z.string().optional(),
  prizePoolText: z.string().optional(),

  registrationFee: z.number().optional(),
  currency: z.string().optional(),
  maxTeamSize: z.number().optional(),

  registrationStartDate: z.string().optional(),
  registrationEndDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  status: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPremiumOnly: z.boolean().optional(),
});

export type ICreateHackathonPayload = z.infer<typeof createHackathonSchema>;
