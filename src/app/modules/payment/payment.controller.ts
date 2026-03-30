import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { stripe } from "../../../config/stripe.config";
import { IRequestUser } from "../../types/user";

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { plan } = req.body;

    console.log(plan);
    console.log(user);

    if (!plan || !["MONTHLY", "YEARLY"].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan",
      });
    }

    const result = await PaymentService.createCheckoutSession(
      user as IRequestUser,
      plan as "MONTHLY" | "YEARLY",
    );

    return res.status(200).json({
      success: true,
      message: "Checkout session created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
};

const stripeWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: "Missing stripe signature",
      });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );

    const result = await PaymentService.handleStripeWebhookEvent(event);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Webhook failed",
    });
  }
};

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
