import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OtpEmailType =
  | "sign-in"
  | "email-verification"
  | "forget-password"
  | "change-email";

type SendOtpEmailPayload = {
  to: string;
  otp: string;
  type: OtpEmailType;
};

export const sendOtpEmail = async ({ to, otp, type }: SendOtpEmailPayload) => {
  const subject =
    type === "email-verification"
      ? "Verify your PrimeHacks account"
      : type === "forget-password"
        ? "Reset your PrimeHacks password"
        : type === "change-email"
          ? "Confirm your new email address"
          : "Your PrimeHacks sign-in code";

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "PrimeHacks <onboarding@resend.dev>",
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#111827;">${subject}</h2>

        <p style="color:#374151;font-size:15px;">
          Use this verification code:
        </p>

        <div style="margin:24px 0;padding:18px 22px;background:#f3f4f6;border-radius:12px;text-align:center;">
          <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#111827;">
            ${otp}
          </span>
        </div>

        <p style="color:#6b7280;font-size:13px;">
          This code will expire soon. If you did not request this, you can ignore this email.
        </p>
      </div>
    `,
    text: `Your PrimeHacks verification code is: ${otp}`,
  });
};
