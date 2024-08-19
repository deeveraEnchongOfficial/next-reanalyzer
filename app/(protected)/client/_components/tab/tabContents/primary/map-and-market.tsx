import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "@/app/(protected)/client/_components/header";
import ItemList from "@/app/(protected)/client/_components/tab/item-list";
import MapsWrapper from "@/app/(protected)/client/_components/maps/maps-wrapper";
import MapsMarker from "@/app/(protected)/client/_components/maps/maps-marker";
import ChipsWrapper from "@/app/(protected)/client/_components/chips/chips-wrapper";
import ChipItem from "@/app/(protected)/client/_components/chips/chip-item";
import MarketTrendsChart from "../../../market-trends-chart";

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

const mapChipItems = [
  { id: uuidv4(), label: "Economy", value: "economy" },
  { id: uuidv4(), label: "Rent Comparables", value: "rentComparables" },
  { id: uuidv4(), label: "Population Growth", value: "populationGrowth" },
  { id: uuidv4(), label: "Sales Comparison", value: "salesComparison" },
];

const marketTrendItemsFirstLayer = [
  { id: uuidv4(), label: "Crime", value: "crime" },
  { id: uuidv4(), label: "Violent", value: "violent" },
  { id: uuidv4(), label: "Property", value: "property" },
];

const marketTrendItemsSecondLayer = [
  { id: uuidv4(), label: "Industry", value: "industry" },
  { id: uuidv4(), label: "Admin", value: "admin" },
  { id: uuidv4(), label: "IT", value: "it" },
  { id: uuidv4(), label: "Business", value: "business" },
  { id: uuidv4(), label: "Etc", value: "etc" },
];

const MapAndMarket = () => {
  const [mapChipActiveTab, setMapChipActiveTab] = useState(
    mapChipItems[0].value
  );
  const [trendTab1, setTrendTab1] = useState(
    marketTrendItemsFirstLayer[0].value
  );
  const [trendTab2, setTrendTab2] = useState(
    marketTrendItemsSecondLayer[0].value
  );

  return (
    <div className="bg-white p-4 rounded-xl">
      <Header header="Maps and Market" />
      <p className="font-bold mt-4">Demographics*</p>
      <ItemList itemList={demographicsList} />
      {/* map overlay */}
      <p className="font-bold mt-4">Map Overlay</p>
      <ChipsWrapper>
        {mapChipItems.map((item) => (
          <ChipItem
            label={item.label}
            compareStr={item.value}
            key={item.id}
            activeTab={mapChipActiveTab}
            setActiveTab={setMapChipActiveTab}
          />
        ))}
      </ChipsWrapper>
      <div className="w-full h-96">
        <MapsWrapper center={{ lat: 53.54992, lng: 10.00678 }} zoom={12}>
          <MapsMarker position={{ lat: 53.54992, lng: 10.00678 }} />
        </MapsWrapper>
      </div>

      <p>
        {"<<for Sales Comparables>>"}
        <br />
        {"<<Property Comps list. Use v2 comps>>"}
        <br />
        {
          "Sale Estimate <<have button to use this value for Price override value>>"
        }
        <br />
        {
          "TABLE: Address, bed/bath. sq ft, year built, Last Sale Amt, Last Sale Date"
        }
        <br />
        <br />

        {"<<for Rent Comparables, use rent cast>>"}
        <br />
        {
          "Rent Estimate <<have button to use this value for rent override value>>"
        }
        <br />
        {"TABLE: Address, bed/bath. sq ft,, year built, Rent"}
        <br />
        <br />

        {
          "<<for economy, and population: have note saying this was case off of census bureau data 2020-2022 -- dynamic based off existing data>>"
        }
        <br />
        {
          ".. actual population data in most recent year (i.e., 2022) with +/- % growth over past 3 years."
        }
        <br />
      </p>
      <p className="font-bold mt-4">Market Trends*</p>
      <ChipsWrapper className="mb-2">
        {marketTrendItemsFirstLayer.map((item) => (
          <ChipItem
            label={item.label}
            compareStr={item.value}
            key={item.id}
            activeTab={trendTab1}
            setActiveTab={setTrendTab1}
          />
        ))}
      </ChipsWrapper>
      <ChipsWrapper className="my-0">
        {marketTrendItemsSecondLayer.map((item) => (
          <ChipItem
            label={item.label}
            compareStr={item.value}
            key={item.id}
            activeTab={trendTab2}
            setActiveTab={setTrendTab2}
          />
        ))}
      </ChipsWrapper>

      <MarketTrendsChart />
    </div>
  );
};

export default MapAndMarket;
