import {
  HackathonStatus,
  RewardType,
} from "../../../../prisma/generated/prisma/enums.js";

export interface IHackathonRewardPayload {
  title: string;
  description?: string;
  rewardType: RewardType;
  amount?: string | number;
  currency?: string;
  rankOrder?: number;
}

export interface IHackathonWinnerPayload {
  submissionId: string;
  title?: string;
  rankOrder?: number;
}

export interface ICreateHackathonPayload {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;

  logoUrl?: string;
  bannerImageUrl?: string;
  websiteUrl?: string;
  discordUrl?: string;
  contactEmail?: string;

  rules?: string;
  eligibility?: string;

  prizePoolText?: string;
  registrationFee?: string | number;
  currency?: string;

  maxTeamSize?: number;

  registrationStartDate?: string | Date;
  registrationEndDate?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
  submissionDeadline: string | Date;

  status?: HackathonStatus;
  isFeatured?: boolean;
  isPremiumOnly?: boolean;

  categoryId: string;
  organizerId: string;

  rewards?: IHackathonRewardPayload[];
  winners?: IHackathonWinnerPayload[];
}

export type IUpdateHackathonPayload = {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;

  logoUrl?: string | null;
  bannerImageUrl?: string | null;
  websiteUrl?: string | null;
  discordUrl?: string | null;
  contactEmail?: string | null;

  rules?: string | null;
  eligibility?: string | null;

  prizePoolText?: string | null;
  registrationFee?: number;
  currency?: string;

  maxTeamSize?: number | null;

  registrationStartDate?: string | Date | null;
  registrationEndDate?: string | Date | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  submissionDeadline?: string | Date;

  status?: HackathonStatus;
  isFeatured?: boolean;
  isPremiumOnly?: boolean;

  categoryId?: string;
};
