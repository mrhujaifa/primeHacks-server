import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { AuthServices } from "./auth.service";
import { IRegisterUser } from "./auth.interface";
import { tokenUtils } from "../../utils/token";
import { auth } from "../../../lib/auth";
import AppError from "../../errors/AppError";
import { fromNodeHeaders } from "better-auth/node";

//* Register user controller
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const paylaod = req.body;

  const result = await AuthServices.registerUser(paylaod);
  const { accessToken, token, refreshToken } = result;
  tokenUtils.betterAuthSessionCookie(res, token as string);
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Registration successful. Please verify your email.",
    data: result,
  });
});

//* Login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthServices.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.betterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "SignIn successful",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await AuthServices.getMe(user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "User fetched successfully",
    data: result,
  });
});

const logoutUser = catchAsync(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.clearCookie("better-auth.session_token", {
    httpOnly: true,
    sameSite: "lax",
  });

  const result = await AuthServices.logout();

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
