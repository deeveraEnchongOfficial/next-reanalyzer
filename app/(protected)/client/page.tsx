"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons/";

// primary
import PrimaryTab from "./_components/tab/tabContents/primary/primary-tab";
import Overview from "./_components/tab/tabContents/primary/overview";
import PropertyDetailsTab from "./_components/tab/tabContents/primary/property-details-tab";
import MapAndMarket from "./_components/tab/tabContents/primary/map-and-market";
import Financials from "./_components/tab/tabContents/primary/financials";
import OwnerInfo from "./_components/tab/tabContents/primary/owner-info";

// secondary
import SecondaryTab from "./_components/tab/tabContents/secondary/secondary-tab";
import BuyAndHold from "./_components/tab/tabContents/secondary/buy-and-hold";
import FixAndFlip from "./_components/tab/tabContents/secondary/fix-and-flip";
import BRR from "./_components/tab/tabContents/secondary/brr";
import HouseHack from "./_components/tab/tabContents/secondary/house-hack";

// bobs analysis
import BobsAnalysis from "./_components/bobs-analysis";

// property details
import PropertyDetails from "./_components/property-details";

// maps and market
import MapsAndMarket from "./_components/maps-and-market";

// ai
import AIConversation from "./_components/ai/ai-conversation";

import { v4 as uuidv4 } from "uuid";

const primaryTabList = [
  {
    id: uuidv4(),
    label: "Overview",
    value: "overview",
    component: <Overview />,
  },
  {
    id: uuidv4(),
    label: "Property Details",
    value: "propertyDetails",
    component: <PropertyDetailsTab />,
  },
  {
    id: uuidv4(),
    label: "Map and Market",
    value: "mapAndMarket",
    component: <MapAndMarket />,
  },
  {
    id: uuidv4(),
    label: "Financials",
    value: "financials",
    component: <Financials />,
  },
  {
    id: uuidv4(),
    label: "Owner Info",
    value: "ownerInfo",
    component: <OwnerInfo />,
  },
];

const secondaryTabList = [
  {
    id: uuidv4(),
    label: "Buy and Hold",
    value: "buyAndHold",
    component: <BuyAndHold />,
  },
  {
    id: uuidv4(),
    label: "Fix and Flip",
    value: "fixAndFlip",
    component: <FixAndFlip />,
    disabled: true,
  },
  {
    id: uuidv4(),
    label: "BRR",
    value: "brr",
    component: <BRR />,
    disabled: true,
  },
  {
    id: uuidv4(),
    label: "House Hack",
    value: "houseHack",
    component: <HouseHack />,
    disabled: true,
  },
];

const ClientRootPage = () => {
  const [activePrimaryTab, setActivePrimaryTab] = useState(
    primaryTabList[0].label
  );
  const [activeSecondaryTab, setActiveSecondaryTab] = useState(
    secondaryTabList[0].label
  );

  return (
    <div className="mx-4 pb-4">
      <div className="mb-4 bg-white flex lg:hidden relative items-center px-1 rounded-full shadow-sm border group focus:outline-none focus-within:ring-2 focus-within:ring-blue-500">
        <Input
          name="search"
          type="search"
          placeholder="Search Property"
          className="w-full py-[1.3rem] !shadow-none !border-none !ring-0 !focus:ring-0 !outline-none px-6 rounded-none focus:outline-none group-focus:ring-0"
        />
        <MagnifyingGlassIcon className="w-5 lg:w-6 h-5 lg:h-6 relative right-5 shrink-0" />
      </div>
      {/* end of search */}

      <div className="flex gap-4">
        {/* left */}
        <div className="relative basis-1/4 shrink-0 hidden lg:block self-start">
          <AIConversation />
        </div>

        {/* right */}

        <div className="w-full">
          <PrimaryTab
            tabList={primaryTabList}
            activeTab={activePrimaryTab}
            setActivePrimaryTab={setActivePrimaryTab}
          />

          <SecondaryTab
            activeTab={activeSecondaryTab}
            setActivePrimaryTab={setActiveSecondaryTab}
            tabList={secondaryTabList}
            className="mt-4"
          />

          {/* bobs analysis */}
          <BobsAnalysis />

          {/* property details */}
          <PropertyDetails />

          {/* maps and market */}
          <MapsAndMarket />
        </div>
      </div>
    </div>
  );
};

export default ClientRootPage;
