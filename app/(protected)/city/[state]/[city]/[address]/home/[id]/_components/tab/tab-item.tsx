import React from "react";

interface TabItemProps {
  label: string;
  onChangeActive: (label: string) => void;
  position?: "left" | "right";
  disabled?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({
  label,
  onChangeActive,
  disabled = false,
}) => {
  return (
    <li
      onClick={() => !disabled && onChangeActive(label)}
      className={`flex items-center justify-center rounded-t-[10px] px-2 
        ${
          disabled
            ? "cursor-not-allowed bg-light-blue text-primary/90"
            : "cursor-pointer hover:text-foreground hover:bg-muted-foreground/10 dark:hover:bg-card-foreground/10 dark:hover:text-foreground"
        }`}
    >
      <span className="text-xs md:text-sm font-semibold">{label}</span>
    </li>
  );
};

export default TabItem;
