"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  BarChart,
  Settings,
  HelpCircle,
  LogOut,
  ExternalLink,
  Medal,
} from "lucide-react";
import { FaUser } from "react-icons/fa";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useCurrentUser } from "@/hooks/use-current-user";

import { logout } from "@/actions/logout";

const sidebarItems = [
  { icon: Users, label: "Users", href: "/administrator/users" },
  {
    icon: BarChart,
    label: "Subscriptions",
    href: "/administrator/subscriptions",
  },
  { icon: ExternalLink, label: "Affiliate Links", href: "/administrator/links" },
  { icon: Medal, label: "Effective Tax Rate", href: "/administrator/effective-tax-rate" },
  // { icon: Settings, label: "Settings", href: "/administrator/settings" },
  // { icon: HelpCircle, label: "Help", href: "/administrator/help" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useCurrentUser();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="flex flex-row p-4 justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Admin</h2>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback className="bg-neutral-700 text-white">
              <FaUser />
            </AvatarFallback>
          </Avatar>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-200 ${
                  isActive
                    ? "bg-gray-200 text-gray-700"
                    : "hover:bg-gray-200 hover:text-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <Button
            variant="ghost"
            className="flex flex-row items-left justify-left px-4 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200"
            onClick={() => logout()}
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
}
