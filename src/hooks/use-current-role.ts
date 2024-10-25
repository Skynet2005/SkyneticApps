import { useSession } from "next-auth/react";

export const useCurrentRole = () => {
  const { data } = useSession();
  const role = data?.user?.role;

  return role;
};
