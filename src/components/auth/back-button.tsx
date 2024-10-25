"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ href, label }) => (
  <Button variant="link" className="font-normal w-full" size="lg" asChild>
    <Link href={href}>{label}</Link>
  </Button>
);
