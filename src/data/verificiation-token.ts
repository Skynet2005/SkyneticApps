import { db } from "@/src/lib/db";

const findVerificationToken = async (criteria: { token?: string; email?: string }) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: criteria,
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  return await findVerificationToken({ token });
};

export const getVerificationTokenByEmail = async (email: string) => {
  return await findVerificationToken({ email });
};
