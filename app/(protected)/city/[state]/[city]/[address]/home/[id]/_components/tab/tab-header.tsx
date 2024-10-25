import React from "react";

interface TabHeader {
  children: React.ReactNode;
  position?: "left" | "right";
}

const TabHeader: React.FC<TabHeader> = ({ children, position = "left" }) => {
  return (
    <ul
      className={`grid top-0 ${
        position === "left" ? "justify-start" : "justify-end"
      } ml-0 md:ml-4 gap-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-7 text-sm font-medium text-center text-muted-foreground border-b border-gray-300`}
    >
      {children}
    </ul>
  );
};

export default TabHeader;
