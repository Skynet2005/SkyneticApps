"use server";

import { currentRole } from "@/src/lib/auth";
import { UserRole } from "@prisma/client";
import { db } from "@/src/lib/db";

export const admin = async (userActions?: { userId: string, newRole?: UserRole, remove?: boolean }[]) => {
  const role = await currentRole();

  if (role !== UserRole.ADMIN) {
    return { error: "Forbidden Server Action!" };
  }

  if (!userActions) {
    return fetchAllUsers();
  }

  return processUserActions(userActions);
};

const fetchAllUsers = async () => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return { users };
  } catch (error) {
    return { error: "An error occurred while fetching users." };
  }
};

const processUserActions = async (userActions: { userId: string, newRole?: UserRole, remove?: boolean }[]) => {
  try {
    for (const action of userActions) {
      const { userId, newRole, remove } = action;
      if (remove) {
        await db.user.delete({ where: { id: userId } });
      } else if (newRole) {
        await db.user.update({ where: { id: userId }, data: { role: newRole } });
      }
    }
    return { success: "User actions completed successfully!" };
  } catch (error) {
    return { error: "An error occurred while processing user actions." };
  }
};
