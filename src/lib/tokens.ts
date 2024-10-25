import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/src/lib/db";
import { getVerificationTokenByEmail } from "@/src/data/verificiation-token";
import { getPasswordResetTokenByEmail } from "@/src/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/src/data/two-factor-token";

const generateTokenData = (token: string, expiresInMinutes: number) => {
  const expires = new Date(new Date().getTime() + expiresInMinutes * 60 * 1000);
  return { token, expires };
};

const deleteExistingToken = async (existingToken: any, tokenType: 'twoFactorToken' | 'passwordResetToken' | 'verificationToken') => {
  if (existingToken) {
    if (tokenType === 'twoFactorToken') {
      await db.twoFactorToken.delete({
        where: { id: existingToken.id },
      });
    } else if (tokenType === 'passwordResetToken') {
      await db.passwordResetToken.delete({
        where: { id: existingToken.id },
      });
    } else if (tokenType === 'verificationToken') {
      await db.verificationToken.delete({
        where: { id: existingToken.id },
      });
    }
  }
};

export const generateTwoFactorToken = async (email: string) => {
  const tokenData = generateTokenData(crypto.randomInt(100_000, 1_000_000).toString(), 5);
  const existingToken = await getTwoFactorTokenByEmail(email);

  await deleteExistingToken(existingToken, "twoFactorToken");

  return await db.twoFactorToken.create({
    data: {
      email,
      ...tokenData,
    },
  });
};

export const generatePasswordResetToken = async (email: string) => {
  const tokenData = generateTokenData(uuidv4(), 60);
  const existingToken = await getPasswordResetTokenByEmail(email);

  await deleteExistingToken(existingToken, "passwordResetToken");

  return await db.passwordResetToken.create({
    data: {
      email,
      ...tokenData,
    },
  });
};

export const generateVerificationToken = async (email: string) => {
  const tokenData = generateTokenData(uuidv4(), 60);
  const existingToken = await getVerificationTokenByEmail(email);

  await deleteExistingToken(existingToken, "verificationToken");

  return await db.verificationToken.create({
    data: {
      email,
      ...tokenData,
    },
  });
};
