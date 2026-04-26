/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import {
  UserRole,
  UserStatus,
} from "../../../../prisma/generated/prisma/enums.js";
import { CookieUtils } from "../../utils/cookie.js";
import { prisma } from "../../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import { jwtUtils } from "../../utils/jwt.js";

export const verifyAuth =
  (...authRoles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /**
       * 1. Better Auth session verification
       * Social login হলে better-auth.session_token থাকবে
       */
      const rawSessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      const sessionToken = rawSessionToken
        ? decodeURIComponent(rawSessionToken).split(".")[0]
        : null;

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());

            console.log("Session Expiring Soon!!");
          }

          if (user.status === UserStatus.BLOCK) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is not active.",
            );
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden access! You do not have permission to access this resource.",
            );
          }

          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };

          return next();
        }
      }

      /**
       * 2. Custom access token verification
       * Email/password login হলে accessToken থাকবে
       */
      const accessToken = CookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No valid session or access token provided.",
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
      );

      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! Invalid access token.",
        );
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as UserRole)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource.",
        );
      }

      req.user = {
        userId: verifiedToken.data!.userId,
        role: verifiedToken.data!.role as UserRole,
        email: verifiedToken.data!.email,
      };

      return next();
    } catch (error: any) {
      next(error);
    }
  };
