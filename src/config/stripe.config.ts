import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET as string;

if (!stripeSecret) {
  throw new Error("Env STRIPE_SECRET not found ");
}
export const stripe = new Stripe(stripeSecret);
