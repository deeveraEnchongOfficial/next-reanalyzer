import React from "react";

interface DividerProps {
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ className }) => {
  return (
    <div
      className={`w-full h-[1px] bg-gray-200 my-4 block md:hidden xl:block ${className}`}
    />
  );
};

export default Divider;
