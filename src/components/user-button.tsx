"use client";

import {
  CheckIcon,
  LogInIcon,
  LogOutIcon,
  Monitor,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { members } from "@wix/members";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/auth";

interface UserButtonProps {
  loggedInMember: members.Member | null;
  className?: string;
}

export const UserButton = ({ loggedInMember, className }: UserButtonProps) => {
  const { login, logout } = useAuth();

  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className={className}>
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-44 max-w-64">
        {loggedInMember && (
          <>
            <DropdownMenuLabel>
              Logged in as{" "}
              {loggedInMember.contact?.firstName || loggedInMember.loginEmail}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem>
                <UserIcon className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 size-4" />
                System default
                {theme === "system" && <CheckIcon className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <SunIcon className="mr-2 size-4" />
                Light
                {theme === "light" && <CheckIcon className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <MoonIcon className="mr-2 size-4" />
                Dark
                {theme === "dark" && <CheckIcon className="ms-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        {loggedInMember ? (
          <DropdownMenuItem onClick={() => logout()}>
            <LogOutIcon className="mr-2 size-4" />
            Logout
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => login()}>
            <LogInIcon className="mr-2 size-4" />
            Login
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
