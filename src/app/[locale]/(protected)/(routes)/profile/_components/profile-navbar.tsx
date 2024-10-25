"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";

export const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/profile/server", label: "Server" },
    { href: "/profile/client", label: "Client" },
    { href: "/profile/admin", label: "Admin" },
    { href: "/profile/settings", label: "Settings" },
  ];

  return (
    <nav className="bg-gradient-to-b from-neutral-200/60 to-neutral-400/90 flex justify-between items-center p-6 rounded-2xl w-full max-w-4xl shadow-lg">
      <div className="flex gap-x-4 w-full">
        {navItems.map(({ href, label }) => (
          <Button
            key={href}
            asChild
            variant={pathname === href ? "default" : "outline"}
            className="flex-1 transition-transform transform hover:scale-105"
          >
            <Link href={href}>
              {label}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
};
