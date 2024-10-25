import React from "react";
import Navbar from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[calc(100vh-65px)]">
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
