import { db } from "@/src/lib/db";

export const getAccountByUserId = async (userId: string) => {
  try {
    return await db.account.findFirst({
      where: { userId },
    });
  } catch (error) {
    console.error("Error fetching account by user ID:", error);
    return null;
  }
};
