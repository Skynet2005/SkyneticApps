import { auth } from "@/auth";

const getSession = async () => {
  return await auth();
};

export const currentUser = async () => {
  const session = await getSession();
  return session?.user;
};

export const currentRole = async () => {
  const session = await getSession();
  return session?.user?.role;
};
