import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/errors/globalErrorHandler";
import { notFound } from "./app/middlewares/errors/notFound";
import cors from "cors";
import cookieParser from "cookie-parser";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { PaymentController } from "./app/modules/payment/payment.controller";

// Validate required environment variables
const requiredEnvVars = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "STRIPE_SECRET",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_CLIENT_URL",
  "FRONTEND_URL",
  "BETTER_AUTH_URL",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is required but not set`);
  }
}

const app: Application = express();

const originUrl = process.env.FRONTEND_URL as string;

// stripe middleware
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhook,
);

// Express middleware
app.use(
  cors({
    origin: [originUrl, "https://primehacks.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// better auth nodeHandler
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());

// All router
app.use("/api/v1", IndexRoutes);

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

// Error handling routes
app.use(globalErrorHandler);
app.use(notFound);

export default app;
