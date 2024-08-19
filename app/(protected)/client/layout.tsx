import React from "react";
import Navbar from "./_components/navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" bg-[#f1f5f9]">
      <Navbar />

      {children}
    </div>
  );
};

export default layout;
