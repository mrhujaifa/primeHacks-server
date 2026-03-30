import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { waitUntil } from "@vercel/functions";

import { prisma } from "./prisma";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is required");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: ["https://primehacks.onrender.com"],

  basePath: "/api/auth",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    onExistingUserSignUp: async ({ user }) => {
      console.log("user already exists", user.email);
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: "ACTIVE",
        input: false,
      },
    },
  },
});
