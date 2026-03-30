export const getPlanDetails = (plan: string) => {
  if (plan === "MONTHLY") {
    return {
      amount: 19,
      priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
      expiresAt: (() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d;
      })(),
    };
  }

  if (plan === "YEARLY") {
    return {
      amount: 50,
      priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
      expiresAt: (() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        return d;
      })(),
    };
  }

  throw new Error("Invalid subscription plan");
};
