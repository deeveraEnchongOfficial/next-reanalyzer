"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@/components/auth/user-button";

const Navbar = () => {
  const pathname = usePathname();

  // Split the pathname into an array of breadcrumb parts
  const pathParts = pathname!.split("/").filter((part) => part);

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 w-full shadow-sm">
      <div className="flex items-center gap-x-2 text-sm">
        <Link href="/" className="text-primary hover:underline">
          Home
        </Link>
        {pathParts.map((part, index) => {
          const href = `/${pathParts.slice(0, index + 1).join("/")}`;
          const isLast = index === pathParts.length - 1;

          return (
            <span key={href} className="flex items-center">
              <span className="mx-2 text-gray-500">/</span>
              {isLast ? (
                <span className="text-gray-500">{part}</span>
              ) : (
                <Link href={href} className="text-primary hover:underline">
                  {part.charAt(0).toUpperCase() + part.slice(1)}
                </Link>
              )}
            </span>
          );
        })}
      </div>
      <UserButton />
    </nav>
  );
};

export default Navbar;
