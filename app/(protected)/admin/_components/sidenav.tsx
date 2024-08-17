"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Server",
    href: "/admin/server",
  },
  {
    name: "Admin",
    href: "/admin/admin",
  },
  {
    name: "Settings",
    href: "/admin/settings",
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full px-3 py-4 w-64 bg-white border-r border-gray-200">
      <Link
        className="mb-4 flex items-center justify-start rounded-md bg-blue-600 p-4"
        href="/"
      >
        <div className="w-full text-white">
          <h1 className="text-lg font-semibold">ReanalyzeAI</h1>{" "}
          {/* Using the provided logo */}
        </div>
      </Link>
      <div className="flex flex-col grow justify-between space-y-2">
        <div className="flex flex-col h-auto w-full grow rounded-md bg-gray-50">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
              ${pathname === link.href ? "bg-sky-100 text-blue-600" : ""}`}
            >
              <p className="hidden md:block">{link.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
