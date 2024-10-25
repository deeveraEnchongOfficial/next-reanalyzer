import React from "react";
import SubNav from "./_components/sub-nav";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[calc(100vh-48px)] lg:h-[calc(100vh-65px)] overflow-hidden flex flex-col bg-[#f1f5f9]">
      <SubNav />
      {children}
    </div>
  );
};

export default layout;
