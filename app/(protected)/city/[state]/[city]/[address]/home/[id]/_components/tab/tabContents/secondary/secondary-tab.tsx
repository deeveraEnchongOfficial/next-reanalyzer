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

interface SecondaryTabProps {
  activeTab: string;
  tabList: TabItem[];
  setActiveTab: (label: string) => void;
  className?: string;
}

const SecondaryTab: React.FC<SecondaryTabProps> = ({
  tabList,
  activeTab,
  setActiveTab,
  className,
}) => {
  return (
    <div className={className}>
      <TabHeader>
        {tabList.map((item) =>
          activeTab === item.label ? (
            <ActiveTabItem
              onChangeActive={setActiveTab}
              label={item.label}
              key={item.id}
              disabled={item.disabled}
            />
          ) : (
            <TabItem
              onChangeActive={setActiveTab}
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
          {item.label === activeTab ? <div>{item.component}</div> : null}
        </div>
      ))}
    </div>
  );
};

export default SecondaryTab;
