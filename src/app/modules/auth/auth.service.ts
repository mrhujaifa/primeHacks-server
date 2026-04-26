import status from "http-status";
import { auth } from "../../../lib/auth.js";
import AppError from "../../errors/AppError.js";
import { ILoginUser, IRegisterUser } from "./auth.interface.js";
import { tokenUtils } from "../../utils/token.js";
import { UserStatus } from "../../../../prisma/generated/prisma/enums.js";
import { IRequestUser } from "../../types/user.js";
import { prisma } from "../../../lib/prisma.js";

//* Register User
const registerUser = async (payload: IRegisterUser) => {
  const { name, email, password } = payload;
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  try {
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

    if (
      error?.status === 401 ||
      error?.statusCode === 401 ||
      error?.code === "INVALID_EMAIL_OR_PASSWORD" ||
      error?.code === "INVALID_CREDENTIALS"
    ) {
      throw new AppError(status.UNAUTHORIZED, "Invalid email or password    ");
    }

    if (error?.status === 403 || error?.statusCode === 403) {
      throw new AppError(status.FORBIDDEN, "Access denied");
    }

    throw new AppError(status.INTERNAL_SERVER_ERROR, "User login failed");
  }
};

const getMe = async (user: IRequestUser) => {
  const data = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      isPremium: true,
      premiumExpiresAt: true,
      premiumPlan: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!data) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return data;
};

const logout = async (request?: Request) => {
  try {
    if (request) {
      await auth.api.signOut({
        headers: request.headers,
      });
    }

    return {
      success: true,
      message: "User logged out successfully",
    };
  } catch (error: any) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      error?.message || "Logout failed",
    );
  }
};

const SignUpOtpVerification = async (email: string, otp: string) => {
  try {
    const data = await auth.api.verifyEmailOTP({
      body: {
        email,
        otp,
      },
    });

    if (!data?.user) {
      throw new AppError(status.BAD_REQUEST, "OTP verification failed");
    }
    return {
      success: true,
      message: "OTP verified successfully",
      user: data.user,
    };
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      error?.message || "OTP verification failed",
    );
  }
};

export const AuthServices = {
  registerUser,
  loginUser,
  getMe,
  logout,
  SignUpOtpVerification,
};
