import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { waitUntil } from "@vercel/functions";

import { prisma } from "./prisma.js";
import { emailOTP } from "better-auth/plugins";
import { sendOtpEmail } from "../app/utils/sendEmail.js";

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

  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,

      otpLength: 6,

      // 10 minutes
      expiresIn: 60 * 10,

      async sendVerificationOTP({ email, otp, type }) {
        await sendOtpEmail({
          to: email,
          otp,
          type,
        });
      },
    }),
  ],

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
