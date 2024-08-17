"use client";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { FaUser } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExitIcon } from "@radix-ui/react-icons";
import { LogoutButton } from "@/components/auth/logout-button";
import { HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons/";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import NavItem from "./nav-item";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Component() {
  const user = useCurrentUser();
  const navbarItems = [
    { id: 1, to: "#", label: "Saved Properties", prefetch: false },
    { id: 2, to: "#", label: "Feedback", prefetch: false },
    { id: 3, to: "#", label: "About", prefetch: false },
  ];
  return (
    <div className="p-4">
      <div className="bg-white flex h-12 lg:h-16  items-center px-2 lg:px-4  rounded-full shadow-sm border">
        <Sheet>
          {/* mobile */}
          <div className="flex items-center gap-4 w-full lg:w-0 px-2 lg:px-0">
            <SheetTrigger className="order-2 lg:order-1" asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden shrink-0"
              >
                <HamburgerMenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <Link
              href="/"
              className="w-full block lg:hidden order-1 lg:order-2"
              prefetch={false}
            >
              <h1 className="text-base lg:text-lg font-light lg:font-semibold">
                ReanalyzeAI
              </h1>
            </Link>
          </div>

          <SheetContent className="px-6" side="left">
            <VisuallyHidden>
              <SheetDescription />
              <SheetTitle />
            </VisuallyHidden>
            <SheetTitle>
              <Link
                href="/"
                className="w-full block lg:hidden order-1 lg:order-2"
                prefetch={false}
              >
                <h1 className="text-lg font-light lg:font-semibold">
                  ReanalyzeAI
                </h1>
              </Link>
            </SheetTitle>

            {/* mobile */}
            <nav className="flex flex-col h-full pb-4 pt-4">
              <div className="grid gap-2 py-4">
                {navbarItems.map((item) => (
                  <NavItem navItem={item} key={item.id}>
                    {item.label}
                  </NavItem>
                ))}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* logo */}
        <div className="flex-1 flex items-center max-w-lg gap-2 h-full">
          <NavItem className="font-semibold text-xl hidden lg:block">
            ReanalyzerAI
          </NavItem>
          <Input
            name="search"
            type="search"
            placeholder="Search Property"
            className="bg-white hidden lg:block w-full py-5 shrink-1 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* desktop */}
        <nav className="ml-auto hidden lg:flex gap-6">
          {navbarItems.map((item, index) => (
            <NavItem navItem={item} key={item.id + index}>
              {item.label}
            </NavItem>
          ))}
        </nav>
        <div className="hidden lg:flex gap-6 ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || undefined} />
                <AvatarFallback className="bg-neutral-700 text-white">
                  <FaUser />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[48]" align="end">
              <LogoutButton>
                <DropdownMenuItem>
                  <ExitIcon className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </LogoutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
