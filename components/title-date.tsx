import React from "react";
import { TitleBlur } from "./ui/blurred-components";

interface TitleDateProps {
  title: string;
  date?: string;
  customElement?: React.ReactNode;
  hasDeepDived?: boolean;
}

const TitleDate: React.FC<TitleDateProps> = ({
  title,
  date = "Last Updated 08/26/2024",
  customElement,
  hasDeepDived = true,
}) => {
  return (
    <div className="w-full flex items-center justify-between mb-4">
      <div className={`${customElement ? "flex items-center gap-4" : ""}`}>
        <div className="flex items-center gap-2">
          <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold w-full ">
            {title}
          </h3>
          {!hasDeepDived ? <TitleBlur /> : <></>}
        </div>
        {customElement ? customElement : <></>}
      </div>
      <p className="text-gray-400 italic whitespace-nowrap">{date}</p>
    </div>
  );
};

export default TitleDate;
