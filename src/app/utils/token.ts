import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";

import { CookieUtils } from "./cookie";
import { Response } from "express";

//* Get access token
const getAccessToken = async (payload: JwtPayload) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not configured");
  }
  
  const accessToken = jwtUtils.createToken(payload, secret, 
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN } as SignOptions
  );
  return accessToken;
};

//* Get refresh token
const getRefreshToken = (payload: JwtPayload) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error("REFRESH_TOKEN_SECRET is not configured");
  }
  
  const refreshToken = jwtUtils.createToken(
    payload,
    secret,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    } as SignOptions,
  );
  return refreshToken;
};

//* set Access token
const setAccessTokenCookie = (res: any, accessToken: string) => {
  CookieUtils.setCookie(res, "accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // 1 day
    maxAge: 60 * 60 * 60 * 24,
  });
};

//* set refresh Token on cookie
const setRefreshTokenCookie = (res: any, refreshToken: string) => {
  CookieUtils.setCookie(res, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    // 7 days
    maxAge: 60 * 60 * 60 * 24 * 7,
  });
};

//* betterAuthSessionCookie setup
const betterAuthSessionCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // 1 day
    maxAge: 60 * 60 * 60 * 24,
  });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  betterAuthSessionCookie,
};
