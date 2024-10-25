"use client";
import React, { useState } from "react";
import ItemList from "../../item-list";
import { BsFillHouseFill } from "react-icons/bs";
import { LuBath } from "react-icons/lu";
import { BiBed } from "react-icons/bi";
import { GiResize } from "react-icons/gi";

import { v4 as uuidv4 } from "uuid";
import { useSearchContext } from "@/context/search-context";

import SecondaryTab from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/tab/tabContents/secondary/secondary-tab";
import BuyAndHold from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/tab/tabContents/secondary/buy-and-hold";
import FixAndFlip from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/tab/tabContents/secondary/fix-and-flip";
import BRR from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/tab/tabContents/secondary/brr";
import HouseHack from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/tab/tabContents/secondary/house-hack";

// components
import { OverviewSkeleton } from "@/components/ui/skeletons";

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

const Overview = () => {
  const { propertyDetailsContext, propertyContext, property, isSearchLoading } = useSearchContext();
  const [activeTab, setActiveTab] = useState("Buy and Hold");

  const propertyOverViewInfoItems = [
    {
      id: uuidv4(),
      label: "Type",
      value: property?.overview?.type,
      icon: <BsFillHouseFill className="h-5 w-5 mt-0.5 shrink-0" />,
    },
    {
      id: uuidv4(),
      label: "Bedroom",
      value: property?.overview?.noOfBedrooms,
      icon: <BiBed className="h-5 w-5 shrink-0" />,
    },
    {
      id: uuidv4(),
      label: "Bath",
      value: property?.overview?.noOfBathrooms,
      icon: <LuBath className="h-5 w-5 shrink-0" />,
    },
    {
      id: uuidv4(),
      label: "Sqft",
      value: property?.overview?.sqft,
      icon: <GiResize className="h-5 w-5 shrink-0" />,
    },
  ];

  const priceListItems = [
    {
      id: uuidv4(),
      label: "List Price",
      value: property?.overview?.listPrice,
      currency: "USD",
    },
    {
      id: uuidv4(),
      label: "Estimated Price",
      value: property?.overview?.estimatedPrice,
      currency: "USD",
    },
    {
      id: uuidv4(),
      label: "Estimated Rent",
      value: property?.overview?.estimatedRent,
      currency: "USD",
    },
  ];

  if (isSearchLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row h-full bg-white p-8 rounded-xl shadow-md">
        <div className="w-full">
          {/* top details */}
          <div className="flex w-full flex-col gap-2 pl-0 md:pl-4 pt-2 lg:pt-0">
            {/* Address and Price List */}
            <div className="flex flex-col">
              <div className="flex w-full flex-col md:flex-row items-start">
                <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold w-full">
                  {/* {propertyDetailsContext?.propertyInfo?.address.label ?? "-"} */}
                  {/* Example call from /propertysearch endpoint */}
                  {/* {propertyDetailsContext?.address?.address ?? "-"}  */}
                  {property?.overview?.address}
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ItemList itemList={priceListItems} />
              <div className="w-full">
                <div className="flex items-center gap-4 flex-wrap w-full">
                  {propertyOverViewInfoItems.map((item) => (
                    <div
                      className="flex flex-row self-start min-w-full sm:min-w-[130px] bg-gray-100 p-2 px-3 gap-4 rounded-xl"
                      key={item.id}
                    >
                      {item.icon}
                      <div className="text-left flex flex-col">
                        <p className="text-black">{item.value ?? "-"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SecondaryTab
        tabList={secondaryTabList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* property analysis */}
    </div>
  );
};

export default Overview;
