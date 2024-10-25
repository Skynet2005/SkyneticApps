import { db } from "@/src/lib/db";

const findUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
};

const findUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  return await findUserByEmail(email);
};

export const getUserById = async (id: string) => {
  return await findUserById(id);
};
