import React from "react";
import TabHeader from "../../tab-header";
import TabItem from "../../tab-item";
import ActiveTabItem from "../../active-tab-item";

type TabItem = {
  id: number | string;
  label: string;
  value: string;
  component?: React.ReactNode;
  disabled?: boolean;
};

interface PrimaryTabProps {
  activeTab: string;
  tabList: TabItem[];
  setActivePrimaryTab: (label: string) => void;
  className?: string;
}

const PrimaryTab: React.FC<PrimaryTabProps> = ({
  tabList,
  activeTab,
  setActivePrimaryTab,
  className,
}) => {
  return (
    <div className={className}>
      <TabHeader>
        {tabList.map((item) =>
          activeTab === item.label ? (
            <ActiveTabItem
              onChangeActive={setActivePrimaryTab}
              label={item.label}
              key={item.id}
              disabled={item.disabled}
            />
          ) : (
            <TabItem
              onChangeActive={setActivePrimaryTab}
              label={item.label}
              key={item.id}
              disabled={item.disabled}
            />
          )
        )}
      </TabHeader>
      {/* items */}
      {tabList.map((item) => (
        <div key={item.id}>
          {item.label === activeTab && !item.disabled ? (
            <div>{item.component}</div>
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};

export default PrimaryTab;
