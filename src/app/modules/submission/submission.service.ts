import status from "http-status";
import { prisma } from "../../../lib/prisma";
import { IRequestUser } from "../../types/user";
import AppError from "../../errors/AppError";

import { ICreateSubmissionPayload } from "./submission.interface";
import {
  HackathonStatus,
  SubmissionStatus,
  UserStatus,
} from "../../../../prisma/generated/prisma/enums";
import { getUserOrThrow } from "../user/user.utils";

const createSubmission = async (
  user: IRequestUser,
  hackathonId: string,
  payload: ICreateSubmissionPayload,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existingUser) {
    throw new AppError(status.UNAUTHORIZED, "User not found");
  }

  if (existingUser.status !== UserStatus.ACTIVE) {
    throw new AppError(status.FORBIDDEN, "Your account is not active");
  }

  const existingHackathon = await prisma.hackathon.findUnique({
    where: {
      id: hackathonId,
    },
    select: {
      id: true,
      title: true,
      status: true,
      submissionDeadline: true,
    },
  });

  if (!existingHackathon) {
    throw new AppError(status.NOT_FOUND, "Hackathon not found");
  }

  //   if (existingHackathon.status !== HackathonStatus.ENDED) {
  //     throw new AppError(
  //       status.BAD_REQUEST,
  //       "Submission is not allowed for this hackathon right now",
  //     );
  //   }

  const now = new Date();

  if (existingHackathon.submissionDeadline < now) {
    throw new AppError(
      status.BAD_REQUEST,
      "Submission deadline has already passed",
    );
  }

  const existingSubmission = await prisma.submission.findFirst({
    where: {
      hackathonId,
      userId: existingUser.id,
    },
    select: {
      id: true,
    },
  });

  if (existingSubmission) {
    throw new AppError(
      status.CONFLICT,
      "You have already submitted to this hackathon",
    );
  }

  const submission = await prisma.submission.create({
    data: {
      hackathonId,
      userId: existingUser.id,
      title: payload.title,
      shortSummary: payload.shortSummary,
      description: payload.description,
      techStack: payload.techStack,
      repositoryUrl: payload.repositoryUrl || null,
      demoUrl: payload.demoUrl || null,
      videoUrl: payload.videoUrl || null,
      thumbnailUrl: payload.thumbnailUrl || null,
      status: SubmissionStatus.DRAFT,
    },
    include: {
      hackathon: {
        select: {
          id: true,
          title: true,
          submissionDeadline: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return submission;
};

const getMySubmissions = async (user: IRequestUser) => {
  await getUserOrThrow(user.userId);

  const submissions = await prisma.submission.findMany({
    where: {
      userId: user.userId,
    },
    select: {
      id: true,
      title: true,
      shortSummary: true,
      description: true,
      techStack: true,
      repositoryUrl: true,
      demoUrl: true,
      videoUrl: true,
      thumbnailUrl: true,
      status: true,
      submittedAt: true,
      createdAt: true,
      updatedAt: true,
      hackathon: {
        select: {
          id: true,
          title: true,
          submissionDeadline: true,
          bannerImageUrl: true,
        },
      },
      user: {
        select: {
          email: true,
          name: true,
          role: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return submissions;
};

export const SubmissionServices = {
  createSubmission,
  getMySubmissions,
};
