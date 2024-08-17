import React from "react";
import PriceList from "../../price-list";

import { v4 as uuidv4 } from "uuid";

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

const BuyAndHold = () => {
  return (
    <div className="bg-white p-4 rounded-xl">
      <h1 className="font-semibold text-2xl">Quick Analysis</h1>
      <PriceList priceList={quickAnalysisList} />
    </div>
  );
};

export default BuyAndHold;
