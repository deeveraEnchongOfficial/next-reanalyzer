"use client";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons/";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import NavItem from "./nav-item";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { LogoutButton } from "./auth/logout-button";
import Image from "next/image";

import LoginButton from "./auth/login-button";

const navbarItems = [
  { id: 1, to: "/", label: "Sell", prefetch: false },
  { id: 2, to: "/", label: "Advertise", prefetch: false },
];

const Navbar = () => {
  const auth = useSession();

  return (
    <div className="flex h-12 lg:h-16 items-center px-2 lg:px-24 shadow-sm border">
      <Sheet>
        <div className="flex items-center gap-4 w-full lg:w-0">
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden shrink-0"
            >
              <HamburgerMenuIcon />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          {/* <NavItem variant="logo" /> */}
          <Link href="/" className="w-full block lg:hidden" prefetch={false}>
            <h1 className="text-lg font-semibold">ReanalyzeAI</h1>
          </Link>
          <LoginButton>
            <FaUserCircle className="w-8 h-8 block lg:hidden" />
          </LoginButton>
        </div>
        <SheetContent className="px-6" side="left">
          <VisuallyHidden>
            <SheetDescription />
          </VisuallyHidden>
          <SheetTitle>
            <NavItem className="font-semibold text-xl block lg:hidden">
              ReanalyzerAI
            </NavItem>
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
      <NavItem
        navItem={{ to: "/", label: "", prefetch: false }}
        className="font-semibold text-xl hidden lg:flex py-7"
      >
        <Image
          src="/images/logo.svg"
          className="w-9 h-9 object-contain object-center"
          width="0"
          height="0"
          sizes="100%"
          alt="logo image"
        />
      </NavItem>
      {/* desktop */}
      <nav className="ml-auto hidden lg:flex gap-6">
        {navbarItems.map((item, index) => (
          <NavItem navItem={item} key={item.id + index}>
            {item.label}
          </NavItem>
        ))}
      </nav>

      <div className="hidden lg:flex gap-6 mx-8">
        {auth.status === "unauthenticated" ? (
          <LoginButton mode="modal" asChild>
            <Button variant="ghost">Sign in</Button>
          </LoginButton>
        ) : (
          <LogoutButton>
            <Button className="hover:bg-gray-100" variant="ghost">
              Logout
            </Button>
          </LogoutButton>
        )}
      </div>
    </div>
  );
};

export default Navbar;
