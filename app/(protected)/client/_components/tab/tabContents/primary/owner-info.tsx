"use client";
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";


const OwnerInfo = () => {
  const user = useCurrentUser();
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Avatar className="w-32 h-32">
            <AvatarImage src={user?.image || undefined} alt="Profile Picture" />
            <AvatarFallback>{getInitials(user?.name ?? '')}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-semibold">{user?.name}</h2>
          </div>
        </div>
        <Button variant="outline" className="text-blue-600 border-blue-600">
          Edit Profile
        </Button>
      </div>
      <CardContent className="mt-6 grid grid-cols-2 gap-4">
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
    </>
  );
};

export default OwnerInfo;

