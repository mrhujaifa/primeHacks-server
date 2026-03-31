import status from "http-status";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/AppError";
import { IRequestUser } from "../../types/user";

const getAllUsers = async () => {
  const alluser = await prisma.user.findMany();

  return alluser;
};

const updateUserRole = async (
  targetUserId: string,
  payload: { role: "USER" | "ORGANIZER" | "ADMIN" },
  user: IRequestUser,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (existingUser.id === user.userId) {
    throw new AppError(status.BAD_REQUEST, "You cannot change your own role");
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      role: payload.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const updateUserStatus = async (
  targetUserId: string,
  payload: { status: "ACTIVE" | "SUSPENDED" | "BLOCK" },
  user: IRequestUser,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (existingUser.id === user.userId) {
    throw new AppError(status.BAD_REQUEST, "You cannot change your own status");
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      status: payload.status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const AdminServices = {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
};
