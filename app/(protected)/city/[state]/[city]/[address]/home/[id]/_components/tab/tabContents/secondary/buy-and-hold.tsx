import React from "react";

// Utils
import { v4 as uuidv4 } from "uuid";

// Components
import { Button } from "@/components/ui/button";
import { BuyAndHoldSkeleton } from "@/components/ui/skeletons";
import ItemList from "../../item-list";
import TitleDate from "@/components/title-date";

// Context
import { useSearchContext } from "@/context/search-context";

const quickAnalysisList = [
  {
    id: uuidv4(),
    label: "Cash-on-cash Return",
    value: 320000,
    currency: "USD",
    extraValue: "/year",
    chip: {
      content: "+5%",
      sign: "minus",
    },
  },
  {
    id: uuidv4(),
    label: "Cash Flow",
    value: 29000,
    currency: "USD",
    extraValue: "/year",
    chip: {
      content: "+12%",
      sign: "check",
    },
  },
  {
    id: uuidv4(),
    label: "IRR",
    value: 1000,
    currency: "USD",
    extraValue: "over 5 yr",
    chip: {
      content: "+12%",
      sign: "check",
    },
  },
  {
    id: uuidv4(),
    label: "Within Budget",
    value: 1000,
    currency: "USD",
    chip: {
      content: "-20%",
      sign: "x",
    },
  },
];

const propertyAnalysis = [
  {
    id: uuidv4(),
    label: "Cash-on-cash Return",
    value: "-26.64%/yr",
    currency: "USD",
    chip: {
      sign: "check",
    },
  },
  {
    id: uuidv4(),
    label: "Cash Flow",
    value: "-3572.98",
    currency: "USD",
    chip: {
      sign: "x",
    },
  },
  {
    id: uuidv4(),
    label: "IRR",
    value: "29.79%",
    chip: {
      sign: "check",
    },
  },
  {
    id: uuidv4(),
    label: "Within Budget",
    value: "177,285",
    currency: "USD",
    chip: {
      sign: "x",
    },
  },
  {
    id: uuidv4(),
    label: "CAP Rate",
    value: "-0.72%",
    currency: "USD",
    chip: {
      sign: "check",
    },
  },
];

const BuyAndHold = () => {
  const { isSearchLoading } = useSearchContext();

  if (isSearchLoading) {
    return <BuyAndHoldSkeleton />;
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex items-center justify-center">
        <TitleDate
          customElement={
            <Button className="rounded-full">Deal Worksheet</Button>
          }
          title="Property Analysis"
        />
      </div>
      <div className="flex flex-col md:flex-row h-full ">
        <ItemList
          baseWrapperClass="bg-gray-50 p-4 rounded-xl border"
          itemList={propertyAnalysis}
        />
      </div>
    </div>
  );
};

export default BuyAndHold;
