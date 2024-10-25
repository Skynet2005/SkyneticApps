"use client";

import { useCurrentUser } from "@/src/hooks/use-current-user";
import { UserInfo } from "@/src/components/user-info";

const ClientPage = () => {
  const user = useCurrentUser();

  return (
    <UserInfo
      label="📱 Client component"
      user={user}
    />
  );
};

export default ClientPage;
