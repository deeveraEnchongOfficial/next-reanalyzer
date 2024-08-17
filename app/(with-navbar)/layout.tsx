import React from "react";
import Navbar from "@/components/navbar";

interface NavbarProps {
  children: React.ReactNode;
}

const layout: React.FC<NavbarProps> = ({ children }) => {
  return (
    <div className="h-[calc(100vh-80px)]">
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
