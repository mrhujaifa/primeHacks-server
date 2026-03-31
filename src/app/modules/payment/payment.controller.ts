import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { stripe } from "../../../config/stripe.config";
import { IRequestUser } from "../../types/user";

import AppError from "../../errors/AppError";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { plan } = req.body;

    console.log(plan);
    console.log(user);

    if (!plan || !["MONTHLY", "YEARLY"].includes(plan)) {
      throw new AppError(status.BAD_REQUEST, "Invalid plan");
    }

    const result = await PaymentService.createCheckoutSession(
      user as IRequestUser,
      plan as "MONTHLY" | "YEARLY",
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    throw new AppError(status.BAD_REQUEST, "Missing webhook configuration");
  }

  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    webhookSecret,
  );
  const result = await PaymentService.handleStripeWebhookEvent(event);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const verifySession = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const result = await PaymentService.verifySession(sessionId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Session verified successfully",
    data: result,
  });
});

export const PaymentController = {
  createCheckoutSession,
  stripeWebhook,
  verifySession,
};
