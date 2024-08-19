"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";

const OwnerInfo = () => {
  const user = useCurrentUser();
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-[64px] h-[64px]">
            <AvatarImage src={user?.image || undefined} alt="Profile Picture" />
            <AvatarFallback>{getInitials(user?.name ?? "")}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-semibold">{user?.name}</h2>
          </div>
        </div>
      </div>
      <CardContent className="p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500">Username</p>
          <p className="font-medium">{user?.name}</p>
        </div>
        <div>
          <p className="text-gray-500">Password</p>
          <p className="font-medium">xxxxxxxx</p>
        </div>
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-gray-500">Subscription</p>
          <p className="font-medium">123456@gmail.com</p>
        </div>
        <div>
          <p className="text-gray-500">Discount</p>
          <p className="font-medium">123456@gmail.com</p>
        </div>
        <div>
          <p className="text-gray-500">Monthly Total</p>
          <p className="font-medium">123456@gmail.com</p>
        </div>
      </CardContent>
    </div>
  );
};

export default OwnerInfo;
