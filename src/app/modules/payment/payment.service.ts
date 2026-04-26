import Stripe from "stripe";
import { PaymentStatus } from "../../../../prisma/generated/prisma/enums.js";
import { stripe } from "../../../config/stripe.config.js";
import { prisma } from "../../../lib/prisma.js";
import { getPlanDetails } from "../../utils/payment.utils.js";
import { IRequestUser } from "../../types/user.js";
import crypto from "node:crypto";
import AppError from "../../errors/AppError.js";
import status from "http-status";

const createCheckoutSession = async (
  users: IRequestUser,
  plan: "MONTHLY" | "YEARLY",
) => {
  const userId = users.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const { amount, priceId } = getPlanDetails(plan);

  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
  if (!clientUrl) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "NEXT_PUBLIC_CLIENT_URL is not configured",
    );
  }

  const payment = await prisma.payment.create({
    data: {
      userId,
      amount,
      plan,
      status: PaymentStatus.UNPAID,
      transactionId: crypto.randomUUID(),
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email ?? undefined,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/pricing`,
    metadata: {
      userId,
      paymentId: payment.id,
      plan,
    },
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      stripeSessionId: session.id,
      paymentGatewayData: session as any,
    },
  });

  return {
    checkoutUrl: session.url,
  };
};

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  const alreadyProcessed = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (alreadyProcessed) {
    return { message: "Event already processed" };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const paymentId = session.metadata?.paymentId;
      const plan = session.metadata?.plan as "MONTHLY" | "YEARLY" | undefined;

      if (!userId || !paymentId || !plan) {
        return { message: "Missing metadata" };
      }

      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        return { message: "Payment not found" };
      }

      const isPaid = session.payment_status === "paid";

      if (!isPaid) {
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            stripeEventId: event.id,
            status: PaymentStatus.FAILED,
            paymentGatewayData: session as any,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          },
        });

        return { message: "Payment not paid" };
      }

      const { expiresAt } = getPlanDetails(plan);

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: paymentId },
          data: {
            stripeEventId: event.id,
            status: PaymentStatus.PAID,
            paymentGatewayData: session as any,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          },
        });

        await tx.user.update({
          where: { id: userId },
          data: {
            isPremium: true,
            premiumPlan: plan,
            premiumExpiresAt: expiresAt,
          },
        });
      });

      return { message: "Payment successful, user premium updated" };
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentId = session.metadata?.paymentId;

      if (!paymentId) return { message: "Missing paymentId" };

      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          stripeEventId: event.id,
          status: PaymentStatus.FAILED,
          paymentGatewayData: session as any,
        },
      });

      return { message: "Checkout expired" };
    }

    default:
      return { message: `Unhandled event: ${event.type}` };
  }
};

const verifySession = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    const payment = await prisma.payment.findFirst({
      where: { stripeSessionId: sessionId },
    });

    if (payment && payment.status !== PaymentStatus.PAID) {
      const plan = payment.plan;
      const { expiresAt } = getPlanDetails(plan);

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.PAID,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          },
        });

        await tx.user.update({
          where: { id: payment.userId },
          data: {
            isPremium: true,
            premiumPlan: plan,
            premiumExpiresAt: expiresAt,
          },
        });
      });
    }
  }

  return { status: session.payment_status };
};

export const PaymentService = {
  createCheckoutSession,
  handleStripeWebhookEvent,
  verifySession,
};

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import Stripe from "stripe";
// import {
//   PaymentStatus,
//   SubscriptionPlan,
//   SubscriptionStatus,
// } from "../../../../prisma/generated/prisma/enums.js";
// import { prisma } from "../../../lib/prisma.js";

// const getSubscriptionExpiryDate = (plan: SubscriptionPlan): Date | null => {
//   const now = new Date();

//   switch (plan) {
//     case SubscriptionPlan.PRO_MONTHLY: {
//       const expiry = new Date(now);
//       expiry.setMonth(expiry.getMonth() + 1);
//       return expiry;
//     }

//     case SubscriptionPlan.PRO_YEARLY: {
//       const expiry = new Date(now);
//       expiry.setFullYear(expiry.getFullYear() + 1);
//       return expiry;
//     }

//     case SubscriptionPlan.FREE:
//     default:
//       return null;
//   }
// };

// const handleCheckoutSessionCompleted = async (
//   event: Stripe.Event,
//   session: Stripe.Checkout.Session,
// ) => {
//   const paymentId = session.metadata?.paymentId;
//   const userId = session.metadata?.userId;
//   const plan = session.metadata?.plan as SubscriptionPlan | undefined;

//   if (!paymentId || !userId || !plan) {
//     return {
//       message:
//         "Missing paymentId, userId, or plan in checkout session metadata",
//     };
//   }

//   const existingPayment = await prisma.payment.findUnique({
//     where: { id: paymentId },
//   });

//   if (!existingPayment) {
//     return {
//       message: "Payment record not found",
//     };
//   }

//   const existingUser = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!existingUser) {
//     return {
//       message: "User not found",
//     };
//   }

//   const isPaid = session.payment_status === "paid";
//   const expiresAt = getSubscriptionExpiryDate(plan);

//   await prisma.$transaction(async (tx) => {
//     const subscription = await tx.subscription.upsert({
//       where: {
//         userId: userId,
//       },
//       update: {
//         plan,
//         status: isPaid
//           ? SubscriptionStatus.ACTIVE
//           : SubscriptionStatus.INACTIVE,
//         startedAt: new Date(),
//         expiresAt,
//         updatedAt: new Date(),
//       },
//       create: {
//         userId,
//         plan,
//         status: isPaid
//           ? SubscriptionStatus.ACTIVE
//           : SubscriptionStatus.INACTIVE,
//         startedAt: new Date(),
//         expiresAt,
//       },
//     });

//     await tx.payment.update({
//       where: {
//         id: paymentId,
//       },
//       data: {
//         subscriptionId: subscription.id,
//         stripeEventId: event.id,
//         stripeSessionId: session.id,
//         stripePaymentIntentId:
//           typeof session.payment_intent === "string"
//             ? session.payment_intent
//             : null,
//         status: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
//         paymentGatewayData: session as any,
//       },
//     });
//   });

//   return {
//     message: "Checkout session completed and subscription updated successfully",
//   };
// };

// const handleCheckoutSessionExpired = async (
//   event: Stripe.Event,
//   session: Stripe.Checkout.Session,
// ) => {
//   const paymentId = session.metadata?.paymentId;

//   if (!paymentId) {
//     return {
//       message: "Missing paymentId in session metadata",
//     };
//   }

//   const payment = await prisma.payment.findUnique({
//     where: { id: paymentId },
//   });

//   if (!payment) {
//     return {
//       message: "Payment not found",
//     };
//   }

//   await prisma.payment.update({
//     where: { id: paymentId },
//     data: {
//       stripeEventId: event.id,
//       stripeSessionId: session.id,
//       stripePaymentIntentId:
//         typeof session.payment_intent === "string"
//           ? session.payment_intent
//           : null,
//       status: PaymentStatus.FAILED,
//       paymentGatewayData: session as any,
//     },
//   });

//   return {
//     message: "Checkout session expired handled successfully",
//   };
// };

// const handlePaymentIntentFailed = async (
//   event: Stripe.Event,
//   paymentIntent: Stripe.PaymentIntent,
// ) => {
//   const paymentId = paymentIntent.metadata?.paymentId;

//   if (!paymentId) {
//     return {
//       message: "Missing paymentId in payment intent metadata",
//     };
//   }

//   const payment = await prisma.payment.findUnique({
//     where: { id: paymentId },
//   });

//   if (!payment) {
//     return {
//       message: "Payment not found",
//     };
//   }

//   await prisma.payment.update({
//     where: { id: paymentId },
//     data: {
//       stripeEventId: event.id,
//       stripePaymentIntentId: paymentIntent.id,
//       status: PaymentStatus.FAILED,
//       paymentGatewayData: paymentIntent as any,
//     },
//   });

//   return {
//     message: "Payment intent failure handled successfully",
//   };
// };

// const handleStripeWebhookEvent = async (event: Stripe.Event) => {
//   const alreadyProcessed = await prisma.payment.findFirst({
//     where: {
//       stripeEventId: event.id,
//     },
//   });

//   if (alreadyProcessed) {
//     return {
//       message: `Event already processed: ${event.id}`,
//     };
//   }

//   switch (event.type) {
//     case "checkout.session.completed": {
//       const session = event.data.object as Stripe.Checkout.Session;
//       return await handleCheckoutSessionCompleted(event, session);
//     }

//     case "checkout.session.expired": {
//       const session = event.data.object as Stripe.Checkout.Session;
//       return await handleCheckoutSessionExpired(event, session);
//     }

//     case "payment_intent.payment_failed": {
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;
//       return await handlePaymentIntentFailed(event, paymentIntent);
//     }

//     default:
//       return {
//         message: `Unhandled event type: ${event.type}`,
//       };
//   }
// };

// export const PaymentService = {
//   handleStripeWebhookEvent,
// };
