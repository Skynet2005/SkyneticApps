import { db } from "@/src/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    return await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });
  } catch (error) {
    console.error("Error fetching two-factor confirmation by user ID:", error);
    return null;
  }
};
