import status from "http-status";
import { auth } from "../../../lib/auth";
import AppError from "../../errors/AppError";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import { tokenUtils } from "../../utils/token";
import { UserStatus } from "../../../../prisma/generated/prisma/enums";
import { IRequestUser } from "../../types/user";
import { prisma } from "../../../lib/prisma";

//* Register User
const registerUser = async (payload: IRegisterUser) => {
  try {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
      body: { name, email, password },
    });

    if (!data?.user) {
      throw new AppError(status.BAD_REQUEST, "Failed to register user");
    }

    const accessToken = await tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      // isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    const refreshToken = await tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      // isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return {
      ...data,
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    if (error.code === "USER_ALREADY_EXISTS" || error.status === 422) {
      throw new AppError(
        status.CONFLICT,
        "User with this email already exists",
      );
    }
    if (error instanceof AppError) throw error;

    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      error?.message || "User registration failed",
    );
  }
};

//* Login User
const loginUser = async (payload: ILoginUser) => {
  try {
    const { email, password } = payload;

    const data = await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });

    if (!data.user) {
      throw new AppError(status.UNAUTHORIZED, "Failed to Login User");
    }

    if (data.user.status === UserStatus.SUSPENDED) {
      throw new AppError(status.FORBIDDEN, "User is Suspended");
    }
    const accessToken = await tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      // isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    const refreshToken = await tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      // isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return {
      ...data,
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      error?.message || "User login failed",
    );
  }
};

const getMe = async (user: IRequestUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      sessions: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return isUserExists;
};

export const AuthServices = {
  registerUser,
  loginUser,
  getMe,
};
