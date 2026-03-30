import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { waitUntil } from "@vercel/functions";

import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: "https://prisma-hacks.onrender.com",

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
