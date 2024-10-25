import React from "react";

interface ChipsWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const ChipsWrapper: React.FC<ChipsWrapperProps> = ({ className, children }) => {
  return (
    <div className={`flex flex-wrap gap-2 my-4 ${className}`}>{children}</div>
  );
};

export default ChipsWrapper;
