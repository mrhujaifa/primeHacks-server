import status from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../../lib/prisma";

export const getUserOrThrow = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(status.UNAUTHORIZED, "User not found");
  }

  return user;
};
