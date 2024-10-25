"use client";

import { useSearchParams } from 'next/navigation';
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { CardWrapper } from "@/src/components/auth/card-wrapper";

export const ErrorCard = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <CardWrapper
      headerLabel="⚠️ Whoa! Something went awry!"
      backButtonHref="/auth/login"
      backButtonLabel="🚀 Back to safety"
    >
      <div className="w-full flex justify-center items-center space-x-2">
        <ExclamationTriangleIcon className="text-destructive animate-bounce" />
        <span className="text-destructive font-bold text-lg">
          Error Detected! Please try again or contact Skynetic at{" "}
          <Link href="https://www.github.com/skynetic2005" className="underline">
            www.github.com/skynetic2005
          </Link>{" "}
          and open an issue.
        </span>
      </div>
      <div>
        <h1>Authentication Error</h1>
        {error && <p>{`Error: ${error}`}</p>}
      </div>
    </CardWrapper>
  );
};
