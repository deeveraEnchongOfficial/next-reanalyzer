"use client";
import React from "react";
import ItemList from "../../item-list";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, HomeIcon } from "@radix-ui/react-icons";
import { LuBath, LuBed } from "react-icons/lu";
import { GiResize } from "react-icons/gi";
import ImageWrapper from "../../../image-wrapper";
import Divider from "@/components/divider";

import { v4 as uuidv4 } from "uuid";

const imageList = [
  { id: uuidv4(), url: "https://picsum.photos/800", alt: "property image" },
  { id: uuidv4(), url: "https://picsum.photos/800", alt: "property image" },
  { id: uuidv4(), url: "https://picsum.photos/800", alt: "property image" },
  { id: uuidv4(), url: "https://picsum.photos/800", alt: "property image" },
  { id: uuidv4(), url: "https://picsum.photos/800", alt: "property image" },
  { id: uuidv4(), url: "https://picsum.photos/800", alt: "property image" },
];

const priceListItems = [
  { id: uuidv4(), label: "List Price", value: 320000, currency: "USD" },
  { id: uuidv4(), label: "Estimated Price", value: 29000, currency: "USD" },
  { id: uuidv4(), label: "Estimated Rent", value: 1000, currency: "USD" },
];

const propertyOverViewInfoItems = [
  {
    id: uuidv4(),
    label: "Type",
    value: "Single Family",
    icon: <HomeIcon className="h-5 w-5 mt-0.5 shrink-0" />,
  },
  {
    id: uuidv4(),
    label: "Bedroom",
    value: 4,
    icon: <LuBed className="h-5 w-5 shrink-0" />,
  },
  {
    id: uuidv4(),
    label: "Bath",
    value: "3",
    icon: <LuBath className="h-5 w-5 shrink-0" />,
  },
  {
    id: uuidv4(),
    label: "Sqft",
    value: 2200,
    icon: <GiResize className="h-5 w-5 shrink-0" />,
  },
];

const Overview = () => {
  const deepdiveSaveButton = (
    <>
      <Button
        aria-label="deep dive analysis button"
        className="bg-primary w-full flex items-center justify-start"
      >
        Deep Dive
      </Button>
      <Button
        variant="secondary"
        aria-label="bookmark save button"
        className="w-full hover:opacity-70 text-black border flex items-center justify-start"
      >
        <BookmarkIcon className="h-5 w-5" />
        Save
      </Button>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row h-full bg-white p-4 rounded-xl">
      <ImageWrapper imageList={imageList} />
      <div className="w-full">
        {/* top details */}
        <div className="flex w-full flex-col gap-2 pl-0 md:pl-4 pt-2 lg:pt-0">
          {/* Address and Price List */}
          <div className="flex flex-col">
            <div className="flex w-full flex-col md:flex-row items-start">
              <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold w-full">
                11 Doane Street, Fermont CA 94538
              </h3>
              {/* deepdive/save button */}
              <div className="flex flex-row lg:flex-col gap-1 self-end md:self-start">
                {deepdiveSaveButton}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row xl:flex-col">
            <ItemList itemList={priceListItems} />
            <div className="w-full">
              <Divider />
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {propertyOverViewInfoItems.map((item) => (
                  <div className="flex flex-row gap-2" key={item.id}>
                    {item.icon}
                    <div className="text-left flex flex-col">
                      <p>{item.label}</p>
                      <p className="text-gray-500">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
