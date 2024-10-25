import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const fromEmail = "onboarding@resend.dev"; // TODO: Change this later to resend email

const sendEmail = async (to: string, subject: string, html: string) => {
  await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const subject = "2FA Code";
  const html = `<p>Your 2FA code: ${token}</p>`;
  await sendEmail(email, subject, html);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  const subject = "Reset your password";
  const html = `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`;
  await sendEmail(email, subject, html);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const subject = "Confirm your email";
  const html = `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`;
  await sendEmail(email, subject, html);
};
