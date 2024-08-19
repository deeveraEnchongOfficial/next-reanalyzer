import React from "react";
import { Button } from "@/components/ui/button";

interface ChipItemProps {
  setActiveTab: (state: string) => void;
  activeTab: string;
  compareStr: string;
  label: string;
}

const ChipItem: React.FC<ChipItemProps> = ({
  activeTab,
  compareStr,
  setActiveTab,
  label,
}) => {
  return (
    <Button
      variant={activeTab === compareStr ? "default" : "outline"}
      onClick={() => setActiveTab(compareStr)}
      className="px-4 py-2 rounded-full"
    >
      {label}
    </Button>
  );
};

export default ChipItem;
