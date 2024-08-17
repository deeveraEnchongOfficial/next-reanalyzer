import React from "react";
import Header from "./header";
import { v4 as uuidv4 } from "uuid";
import PriceList from "./tab/price-list";

const demographicsList = [
  { id: uuidv4(), label: "List Price", value: 70000, currency: "USD" },
  {
    id: uuidv4(),
    label: "City Population",
    value: 110000,
    extraValue: "people",
  },
  {
    id: uuidv4(),
    label: "Education Level",
    extraValue: "30% college graduates",
  },
];

const MapsAndMarket = () => {
  return (
    <div className="bg-white p-4 mt-4 rounded-xl">
      <Header header="Maps and Market" />
      <p className="font-bold mt-4">Demographics*</p>
      <PriceList priceList={demographicsList} />{" "}
      {/* change component name to more general - wip */}
      {/* map overlay */}
    </div>
  );
};

export default MapsAndMarket;
