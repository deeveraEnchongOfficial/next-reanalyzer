import React from "react";

interface TabItemProps {
  label: string;
  onChangeActive: (label: string) => void;
  position?: "left" | "right";
}

const TabItem: React.FC<TabItemProps> = ({ label, onChangeActive }) => {
  return (
    <li
      onClick={() => onChangeActive(label)}
      className="flex items-center justify-center cursor-pointer rounded-t-[9px] hover:text-foreground hover:bg-muted-foreground/10 dark:hover:bg-card-foreground/10 dark:hover:text-foreground px-6 lg:px-10"
    >
      <span className="text-xs md:text-sm font-base">{label}</span>
    </li>
  );
};

export default TabItem;
