"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserButton } from "@/components/auth/user-button";

const AppSidebarFooter = () => {
  const router = useRouter();
  const user = useCurrentUser();

  return (
    <SidebarFooter className="bg-white">
      {user == null ? (
        <>
          <Skeleton className="w-full h-[50px] rounded-md" />
        </>
      ) : (
        <SidebarMenu className="cursor-pointer">
          <SidebarMenuItem>
            <UserButton />
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    </SidebarFooter>
  );
};
export default AppSidebarFooter;
