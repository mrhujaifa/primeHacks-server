import express from "express";
import { PaymentController } from "./payment.controller";
import { verifyAuth } from "../../middlewares/auth/verifyAuth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";

const router = express.Router();

router.post(
  "/create-checkout-session",
  verifyAuth(UserRole.ADMIN, UserRole.USER, UserRole.ORGANIZER),
  PaymentController.createCheckoutSession,
);

// router.post(
//   "/stripe/webhook",
//   express.raw({ type: "application/json" }),
//   PaymentController.stripeWebhook,
// );

export const PaymentRoutes = router;
