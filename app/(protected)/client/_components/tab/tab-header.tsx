import React from "react";

interface TabHeader {
  children: React.ReactNode;
  position?: "left" | "right";
}

const TabHeader: React.FC<TabHeader> = ({ children, position = "left" }) => {
  return (
    <ul
      className={`grid ${
        position === "left" ? "justify-start" : "justify-end"
      } ml-0 md:ml-8 gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 text-sm font-medium text-center text-muted-foreground border-b border-gray-300`}
    >
      {children}
    </ul>
  );
};

export default TabHeader;
