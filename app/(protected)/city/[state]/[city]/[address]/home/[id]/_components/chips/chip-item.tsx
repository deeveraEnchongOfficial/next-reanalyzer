import React from "react";
import { Button } from "@/components/ui/button";
interface ChipItemProps {
  setActiveTab: (state: string) => void;
  activeTab: string;
  compareStr: string;
  label: string;
  disabled?: boolean;
  tootltipText?: string;
}

const ChipItem: React.FC<ChipItemProps> = ({
  activeTab,
  compareStr,
  setActiveTab,
  label,
  disabled = false,
  tootltipText,
}) => {
  return (
    <Button
      title={disabled ? tootltipText : ""}
      variant={
        disabled ? "outline" : activeTab === compareStr ? "default" : "outline"
      }
      onClick={!disabled ? () => setActiveTab(compareStr) : () => {}}
      className={`px-4 py-2 rounded-full ${
        disabled
          ? "cursor-default bg-muted hover:bg-muted text-gray-400 hover:text-gray-400"
          : ""
      }`}
    >
      {label}
    </Button>
  );
};

export default ChipItem;
