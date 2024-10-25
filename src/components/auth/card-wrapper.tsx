"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/src/components/ui/card";
import { Header } from "@/src/components/auth/header";
import { Social } from "@/src/components/auth/social";
import { BackButton } from "@/src/components/auth/back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}) => (
  <Card className="w-[500px] shadow-md bg-neutral-200">
    <CardHeader>
      <Header label={headerLabel} />
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
    {showSocial && (
      <CardFooter>
        <Social />
      </CardFooter>
    )}
    <CardFooter>
      <BackButton
        label={backButtonLabel}
        href={backButtonHref}
      />
    </CardFooter>
  </Card>
);
