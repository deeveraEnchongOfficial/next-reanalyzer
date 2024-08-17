import React from "react";
import Link from "next/link";

type NavItemProps = {
  navItem?: {
    to: string;
    prefetch: boolean;
    label: string;
  };
  children: React.ReactNode;
  className?: string;
};

const NavItem: React.FC<NavItemProps> = ({ navItem, children, className }) => {
  return (
    <Link
      href={navItem?.to || "#"}
      className={`group inline-flex w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50 ${className}`}
      prefetch={navItem?.prefetch}
    >
      {children}
    </Link>
  );
};

export default NavItem;
