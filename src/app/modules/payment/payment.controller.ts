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

export const PaymentController = {
  createCheckoutSession,
  stripeWebhook,
};

// import { Request, Response } from "express";
// import AppError from "../../errors/AppError";
// import status from "http-status";
// import { stripe } from "../../../config/stripe.config";
// import { PaymentService } from "./payment.service";

// const stripeWebhook = async (req: Request, res: Response) => {
//   try {
//     const signature = req.headers["stripe-signature"];
//     const webhookSecret = process.env.STRIPE_WEBHOOK as string;

//     if (!webhookSecret) {
//       throw new AppError(status.NOT_FOUND, "Env STRIPE_WEBHOOK not found");
//     }

//     if (!signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing stripe signature",
//       });
//     }

//     if (!webhookSecret) {
//       return res.status(500).json({
//         success: false,
//         message: "Stripe webhook secret is not configured",
//       });
//     }

//     const event = stripe.webhooks.constructEvent(
//       req.body,
//       signature,
//       webhookSecret,
//     );

//     const result = await PaymentService.handleStripeWebhookEvent(event);

//     return res.status(200).json({
//       success: true,
//       message: result.message,
//     });
//   } catch (error: any) {
//     console.error("Stripe webhook error:", error);

//     return res.status(400).json({
//       success: false,
//       message: error?.message || "Webhook handling failed",
//     });
//   }
// };

// export const PaymentController = {
//   stripeWebhook,
// };
