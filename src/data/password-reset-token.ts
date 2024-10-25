import { db } from "@/src/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  return await findPasswordResetToken({ token });
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  return await findPasswordResetToken({ email });
};

const findPasswordResetToken = async (criteria: { token?: string; email?: string }) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: criteria,
    });
    return passwordResetToken;
  } catch {
    return null;
  }
};
