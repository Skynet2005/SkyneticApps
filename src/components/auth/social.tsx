"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSignIn = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  const buttonStyles = "w-full flex items-center justify-center gap-x-2 bg-neutral-100 text-black hover:bg-neutral-300 transition-transform transform hover:scale-105";

  return (
    <div className="flex items-center w-full gap-x-4 p-4 bg-gradient-to-b from-blue-600/80 to-black/95 rounded-lg shadow-lg">
      <Button
        size="lg"
        className={buttonStyles}
        variant="outline"
        onClick={() => handleSignIn("google")}
      >
        <FcGoogle className="h-6 w-6" />
        <span className="font-semibold">Google</span>
      </Button>
      <Button
        size="lg"
        className={buttonStyles}
        variant="outline"
        onClick={() => handleSignIn("github")}
      >
        <FaGithub className="h-6 w-6" />
        <span className="font-semibold">GitHub</span>
      </Button>
    </div>
  );
};
