"use client";

import { UserRole } from "@prisma/client";
import { useCurrentRole } from "@/src/hooks/use-current-role";
import { FormError } from "@/src/components/form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  return role === allowedRole ? <>{children}</> : <FormError message="You do not have permission to view this content!" />;
};
