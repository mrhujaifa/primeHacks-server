import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/AppError";
import { IRequestUser } from "../../types/user";
import {
  ICreateHackathonPayload,
  IUpdateHackathonPayload,
} from "./hackathon.interface";
import {
  HackathonStatus,
  UserRole,
  UserStatus,
} from "../../../../prisma/generated/prisma/enums";
import { SlugUtils } from "../../utils/slugUtils";
import { getUserOrThrow } from "../user/user.utils";

//* create Hackathon

const createHackathon = async (
  user: IRequestUser,
  payload: ICreateHackathonPayload,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!existingUser) {
    throw new AppError(status.UNAUTHORIZED, "user not found");
  }

  if (existingUser.status !== UserStatus.ACTIVE) {
    throw new AppError(status.FORBIDDEN, "Your account is not active");
  }

  if (
    existingUser.role !== UserRole.ADMIN &&
    existingUser.role !== UserRole.ORGANIZER
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to create a hackathon",
    );
  }

  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
    select: {
      name: true,
      id: true,
    },
  });

  if (!category) {
    throw new AppError(status.NOT_FOUND, "category not found");
  }

  const slug = await SlugUtils.generateUniqueSlug(payload.title);

  const hackathonData = {
    title: payload.title,
    slug,
    shortDescription: payload.shortDescription,
    fullDescription: payload.fullDescription,

    logoUrl: payload.logoUrl || null,
    bannerImageUrl: payload.bannerImageUrl || null,
    websiteUrl: payload.websiteUrl || null,
    discordUrl: payload.discordUrl || null,
    contactEmail: payload.contactEmail || null,

    rules: payload.rules || null,
    eligibility: payload.eligibility || null,

    prizePoolText: payload.prizePoolText || null,
    registrationFee: payload.registrationFee ?? 0,
    currency: payload.currency ?? "USDT",

    maxTeamSize: payload.maxTeamSize ?? null,

    registrationStartDate: payload.registrationStartDate
      ? new Date(payload.registrationStartDate)
      : null,
    registrationEndDate: payload.registrationEndDate
      ? new Date(payload.registrationEndDate)
      : null,
    startDate: payload.startDate ? new Date(payload.startDate) : null,
    endDate: payload.endDate ? new Date(payload.endDate) : null,
    submissionDeadline: new Date(payload.submissionDeadline),

    status: payload.status ?? HackathonStatus.DRAFT,
    isFeatured: payload.isFeatured ?? false,
    isPremiumOnly: payload.isPremiumOnly ?? false,

    categoryId: payload.categoryId,
    organizerId: existingUser.id,
  };
  const hackathon = await prisma.hackathon.create({
    data: hackathonData,
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      fullDescription: true,
      logoUrl: true,
      bannerImageUrl: true,
      websiteUrl: true,
      discordUrl: true,
      contactEmail: true,
      rules: true,
      eligibility: true,
      prizePoolText: true,
      registrationFee: true,
      currency: true,
      maxTeamSize: true,
      registrationStartDate: true,
      registrationEndDate: true,
      startDate: true,
      endDate: true,
      submissionDeadline: true,
      status: true,
      isFeatured: true,
      isPremiumOnly: true,
      createdAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return hackathon;
};

//* Get All Hackathons
const getAllHackathon = async () => {
  const allHackathons = await prisma.hackathon.findMany({
    include: {
      organizer: true,
    },
  });

  return allHackathons;
};

//* Get own Hackathons
const getOwnHackathons = async (user: IRequestUser) => {
  const existingOrganizer = await prisma.user.findFirst({
    where: {
      id: user.userId,
      role: {
        in: [UserRole.ADMIN, UserRole.ORGANIZER],
      },
    },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
    },
  });

  if (!existingOrganizer) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to access hackathons",
    );
  }

  const hackathons = await prisma.hackathon.findMany({
    where: {
      organizerId: existingOrganizer.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      fullDescription: true,

      logoUrl: true,
      bannerImageUrl: true,
      websiteUrl: true,
      discordUrl: true,
      contactEmail: true,

      rules: true,
      eligibility: true,
      prizePoolText: true,
      registrationFee: true,
      currency: true,
      maxTeamSize: true,

      registrationStartDate: true,
      registrationEndDate: true,
      startDate: true,
      endDate: true,
      submissionDeadline: true,

      status: true,
      isFeatured: true,
      isPremiumOnly: true,

      createdAt: true,
      updatedAt: true,

      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return hackathons;
};

const getHackathonById = async (user: IRequestUser, hackathonId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!existingUser) {
    throw new AppError(status.UNAUTHORIZED, "User not found");
  }

  const existingHackathon = await prisma.hackathon.findUnique({
    where: {
      id: hackathonId,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      rewards: true,
      hackathonWinners: true,
    },
  });

  if (!existingHackathon) {
    throw new AppError(status.NOT_FOUND, "Hackathon not found");
  }

  const isOwner = existingHackathon.organizerId === user.userId;
  const isSuperAdmin = user.role === "ADMIN";

  if (!isOwner && !isSuperAdmin) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to access this hackathon",
    );
  }

  return existingHackathon;
};

//* update hackathon
const updateHackathon = async (
  user: IRequestUser,
  hackathonId: string,
  payload: IUpdateHackathonPayload,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
  });

  if (!existingUser) {
    throw new AppError(status.UNAUTHORIZED, "User not found");
  }

  const existingHackathon = await prisma.hackathon.findUnique({
    where: {
      id: hackathonId,
    },
  });

  if (!existingHackathon) {
    throw new AppError(status.NOT_FOUND, "Hackathon not found");
  }

  // owner check
  if (existingHackathon.organizerId !== user.userId) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not allowed to update this hackathon",
    );
  }

  if (payload.categoryId) {
    const isCategoryExists = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!isCategoryExists) {
      throw new AppError(status.BAD_REQUEST, "Please select a valid category.");
    }
  }

  const filteredPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined),
  );

  const updatedHackathon = await prisma.hackathon.update({
    where: {
      id: hackathonId,
    },
    data: filteredPayload,
  });

  return updatedHackathon;
};

//* Hanlde Delete Hackathons
const deleteHackathon = async (user: IRequestUser, hackathonId: string) => {
  await getUserOrThrow(user.userId);

  const existingHackathon = await prisma.hackathon.findUnique({
    where: {
      id: hackathonId,
    },
    select: {
      id: true,
      organizerId: true,
      title: true,
      status: true,
    },
  });

  if (!existingHackathon) {
    throw new AppError(status.NOT_FOUND, "Hackathon not found");
  }

  // owner check
  if (existingHackathon.organizerId !== user.userId) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not allowed to delete this hackathon",
    );
  }

  const deletedHackathon = await prisma.hackathon.delete({
    where: {
      id: hackathonId,
    },
    select: {
      id: true,
      title: true,
    },
  });

  return deletedHackathon;
};

//* get Hackathon Categories
const getAllHackathonCategories = async () => {
  const getCategories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return getCategories;
};

export const HackathonServices = {
  createHackathon,
  getAllHackathon,
  getHackathonById,
  getOwnHackathons,
  updateHackathon,
  deleteHackathon,
  getAllHackathonCategories,
};
