"use client";

import { logout } from "@/src/actions/logout";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ children }) => {
  const handleLogout = () => {
    logout();
  };

  return (
    <span onClick={handleLogout} className="cursor-pointer">
      {children}
    </span>
  );
};
