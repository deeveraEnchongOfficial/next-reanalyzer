import React from "react";

interface ActiveTabItemProps {
  label: string;
  onChangeActive: (label: string) => void;
  disabled?: boolean;
}

const ActiveTabItem: React.FC<ActiveTabItemProps> = ({
  label,
  onChangeActive,
  disabled = false,
}) => {
  return (
    <li
      onClick={() => !disabled && onChangeActive(label)}
      className={`flex items-center justify-center rounded-t-[9px] py-2 lg:py-[.8rem] px-6 lg:px-10 
        ${
          disabled
            ? "cursor-not-allowed opacity-50 bg-muted text-gray-400"
            : "cursor-pointer bg-primary text-white"
        }`}
    >
      <span className="text-xs md:text-sm font-base">{label}</span>
    </li>
  );
};

export default ActiveTabItem;
