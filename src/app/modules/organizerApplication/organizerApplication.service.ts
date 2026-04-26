import status from "http-status";
import { prisma } from "../../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import { IRequestUser } from "../../types/user.js";
import { TCreateOrganizerApplicationPayload } from "./organizerApplication.interface.js";
import {
  OrganizerApplicationStatus,
  UserRole,
  UserStatus,
} from "../../../../prisma/generated/prisma/enums.js";

const createOrganizerApplication = async (
  user: IRequestUser,
  payload: TCreateOrganizerApplicationPayload,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    select: {
      id: true,
      role: true,
      status: true,
      organizerApplicationStatus: true,
    },
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (existingUser.status === UserStatus.BLOCK) {
    throw new AppError(status.UNAUTHORIZED, "Blocked user cannot apply");
  }

  if (existingUser.role === UserRole.ORGANIZER) {
    throw new AppError(status.CONFLICT, "You are already an organizer");
  }

  if (existingUser.role === UserRole.ADMIN) {
    throw new AppError(status.CONFLICT, "Admin does not need organizer access");
  }

  if (
    existingUser.organizerApplicationStatus ===
    OrganizerApplicationStatus.PENDING
  ) {
    throw new AppError(
      status.CONFLICT,
      "You already have a pending organizer application",
    );
  }

  if (
    existingUser.organizerApplicationStatus ===
    OrganizerApplicationStatus.APPROVED
  ) {
    throw new AppError(
      status.CONFLICT,
      "Your organizer application is already approved",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const application = await tx.organizerApplication.create({
      data: {
        userId: user.userId,
        organizationName: payload.organizationName,
        websiteUrl: payload.websiteUrl || null,
        contactEmail: payload.contactEmail,
        previousExperience: payload.previousExperience || null,
        reason: payload.reason,
        expectedHackathonType: payload.expectedHackathonType || null,
        agreeToGuidelines: payload.agreeToGuidelines,
      },
    });

    await tx.user.update({
      where: {
        id: user.userId,
      },
      data: {
        organizerApplicationStatus: OrganizerApplicationStatus.PENDING,
      },
    });

    return application;
  });

  return result;
};

const getMyOrganizerApplication = async (user: IRequestUser) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      organizerApplicationStatus: true,
    },
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const application = await prisma.organizerApplication.findFirst({
    where: {
      userId: user.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      organizationName: true,
      websiteUrl: true,
      contactEmail: true,
      previousExperience: true,
      reason: true,
      expectedHackathonType: true,
      agreeToGuidelines: true,
      rejectionReason: true,
      reviewedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    user: existingUser,
    application,
  };
};

export const OrganizerApplicationServices = {
  createOrganizerApplication,
  getMyOrganizerApplication,
};
