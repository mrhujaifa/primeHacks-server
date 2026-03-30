import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/errors/globalErrorHandler";
import { notFound } from "./app/middlewares/errors/notFound";
import cors from "cors";
import cookieParser from "cookie-parser";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { PaymentController } from "./app/modules/payment/payment.controller";

const app: Application = express();

// stripe middleware
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhook,
);

// Express middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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
