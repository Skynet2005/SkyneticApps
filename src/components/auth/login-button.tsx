"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/src/components/ui/dialog";
import { LoginForm } from "@/src/components/auth/login-form";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  children,
  mode = "redirect",
  asChild,
}) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/auth/login");
  };

  const renderModal = () => (
    <Dialog>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="p-0 w-auto bg-transparent border-none">
        <LoginForm />
      </DialogContent>
    </Dialog>
  );

  const renderRedirect = () => (
    <span onClick={handleRedirect} className="cursor-pointer">
      {children}
    </span>
  );

  return mode === "modal" ? renderModal() : renderRedirect();
};
