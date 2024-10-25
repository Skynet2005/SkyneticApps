"use client";

import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/src/hooks/use-current-user";
import { logout } from "@/src/actions/logout";
import { SidePaths } from "@/src/app/[locale]/(protected)/(routes)/_components/layout/sidebar-constants";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";

export const UserButton = () => {
  const user = useCurrentUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  const goToSettings = () => {
    router.push("/profile/settings");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem onSelect={goToDashboard}>
          <Image
            src={SidePaths["General"][0].route}
            alt="Dashboard Icon"
            className="h-4 w-4 mr-2"
            width={16}
            height={16}
          />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={goToSettings}>
          <Image
            src={SidePaths["General"][1].route}
            alt="Settings Icon"
            className="h-4 w-4 mr-2"
            width={16}
            height={16}
          />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogout}>
          <ExitIcon className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
