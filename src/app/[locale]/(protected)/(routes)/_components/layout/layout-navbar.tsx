import Image from "next/image";
import Link from "next/link";
import { Montserrat } from 'next/font/google';
import { UserButton } from "@/src/components/auth/user-button";
import { cn } from "@/src/lib/utils";
import Sidebar from "./sidebar";
import { ModeToggle } from "@/src/components/ui/mode-toggle";

const poppins = Montserrat({ weight: '600', subsets: ['latin'] });

const DashboardNavbar = async () => {
  return (
    <div className="flex fixed top-0 right-0 z-50 w-screen items-center justify-between border-b border-neutral-950 bg-neutral-900 px-3 py-2">
      <div className="group flex flex-row w-full justify-between items-center">

        {/* Sidebar Component */}
        <div className="text-neutral-100">
          <Sidebar />
        </div>

        {/* Logo and Title */}
        <Link href='/dashboard' className='flex items-center gap-4 md:pl-4'>
          <Image src='/logo.png' alt='logo' width={28} height={28} />
          <h1 className={cn(
            "text-[2vw] md:text-2xl font-bold group[data-theme='light'] text-red-500 dark:text-neutral-100",
            poppins.className
          )}>
            Skynetics Apps!
          </h1>
        </Link>

        {/* User Controls */}
        <div className="flex justify-center items-center gap-4 rounded-md">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
