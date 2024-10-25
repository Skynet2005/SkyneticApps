import { db } from "@/src/lib/db";

const findTwoFactorToken = async (criteria: { token?: string; email?: string }) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: criteria,
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  return await findTwoFactorToken({ token });
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  return await findTwoFactorToken({ email });
};
