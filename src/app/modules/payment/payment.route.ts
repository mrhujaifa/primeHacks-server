import express from "express";
import { PaymentController } from "./payment.controller.js";
import { verifyAuth } from "../../middlewares/auth/verifyAuth.js";
import { UserRole } from "../../../../prisma/generated/prisma/enums.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  verifyAuth(UserRole.ADMIN, UserRole.USER, UserRole.ORGANIZER),
  PaymentController.createCheckoutSession,
);

router.get(
  "/verify-session/:sessionId",
  verifyAuth(UserRole.USER, UserRole.ADMIN, UserRole.ORGANIZER),
  PaymentController.verifySession,
);

export const PaymentRoutes = router;
