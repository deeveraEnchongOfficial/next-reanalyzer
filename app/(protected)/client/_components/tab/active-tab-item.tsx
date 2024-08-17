import React from "react";

interface ActiveTabItem {
  label: string;
  onChangeActive: (label: string) => void;
}

const ActiveTabItem: React.FC<ActiveTabItem> = ({ label, onChangeActive }) => {
  return (
    <li
      onClick={() => onChangeActive(label)}
      className="flex items-center justify-center cursor-pointer bg-primary text-white bg-muted rounded-t-[9px] py-2 lg:py-[.8rem] px-6 lg:px-10"
    >
      <span className="text-xs md:text-sm font-base">{label}</span>
    </li>
  );
};

export default ActiveTabItem;
