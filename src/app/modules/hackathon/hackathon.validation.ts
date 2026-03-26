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

export const updateHackathonValidationSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  shortDescription: z.string().min(10).max(300).optional(),
  fullDescription: z.string().min(30).optional(),

  logoUrl: z.string().url().nullable().optional(),
  bannerImageUrl: z.string().url().nullable().optional(),
  websiteUrl: z.string().url().nullable().optional(),
  discordUrl: z.string().url().nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),

  rules: z.string().nullable().optional(),
  eligibility: z.string().nullable().optional(),

  prizePoolText: z.string().nullable().optional(),
  registrationFee: z.number().min(0).optional(),
  currency: z.string().min(2).max(10).optional(),

  maxTeamSize: z.number().int().positive().nullable().optional(),

  registrationStartDate: z.string().datetime().nullable().optional(),
  registrationEndDate: z.string().datetime().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  submissionDeadline: z.string().datetime().optional(),

  status: z
    .enum(["ONGOING", "DRAFT", "UPCOMING", "COMPLETED", "ACTIVE", "ENDED"])
    .optional(),

  isFeatured: z.boolean().optional(),
  isPremiumOnly: z.boolean().optional(),

  categoryId: z.string().optional(),
});

export type IUpdateHackathonPayload = z.infer<
  typeof updateHackathonValidationSchema
>;
