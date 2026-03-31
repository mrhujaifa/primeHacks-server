import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { waitUntil } from "@vercel/functions";

import { prisma } from "./prisma";

const trustedOrigins = process.env.FRONTEND_URL as string;
const baseUrl = process.env.BETTER_AUTH_URL as string;

if (!trustedOrigins || !baseUrl) {
  throw new Error(
    "BETTER_AUTH_URL and FRONTEND_URL environment variables are required",
  );
}

export const auth = betterAuth({
  baseURL: baseUrl,

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [trustedOrigins],

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
