import React, { useEffect, useCallback, useState } from "react";
import { BookmarkFilledIcon, BookmarkIcon } from "@radix-ui/react-icons";
import { BsFillHouseFill } from "react-icons/bs";
import { LuBath } from "react-icons/lu";
import { BiBed } from "react-icons/bi";
import { GiResize } from "react-icons/gi";
import { PiShareFatBold } from "react-icons/pi";
import { formatNumberWithCommas } from "@/lib/functions/formatNumberWithCommas";
import type { PropertySearch } from "@/lib/definition";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  HorizontalSkeleton,
  Skeleton,
  ImageSekeleton,
} from "@/components/ui/skeletons";
import { useSearchContext } from "@/context/search-context";
import { getStreetViewImage } from "@/actions/street-view-images";
import ItemList from "../[address]/home/[id]/_components/tab/item-list";

import { v4 as uuidv4 } from "uuid";

interface HouseCardProps {
  isSelected?: boolean;
  houseItem: PropertySearch | undefined;
  variant?: "default" | "skeleton" | "horizontal" | "skeleton-horizontal";
  handleOnSelectHouse?: (selected: PropertySearch | undefined) => void;
  isLoading: boolean;
}

const propertyAnalysis = [
  {
    id: uuidv4(),
    label: "Cash-on-cash Return",
    value: "-26.64%/yr",
    currency: "USD",
    chip: {
      sign: "x",
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

const HouseCard: React.FC<HouseCardProps> = ({
  houseItem,
  isSelected,
  variant = "default",
  handleOnSelectHouse,
  isLoading,
}) => {
  const { setPropertyContext } = useSearchContext();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);

  const propertyOverViewInfoItems = [
    {
      id: uuidv4(),
      label: "Type",
      value: houseItem?.propertyType,
      icon: <BsFillHouseFill className="h-4 w-4 shrink-0" />,
    },
    {
      id: uuidv4(),
      label: "Bedroom",
      value: houseItem?.bedrooms,
      icon: <BiBed className="h-4 w-4 shrink-0" />,
    },
    {
      id: uuidv4(),
      label: "Bath",
      value: houseItem?.bathrooms,
      icon: <LuBath className="h-4 w-4 shrink-0" />,
    },
    {
      id: uuidv4(),
      label: "Sqft",
      value: houseItem?.squareFeet,
      icon: <GiResize className="h-4 w-4 shrink-0" />,
    },
  ];

  const priceListItems = [
    {
      id: uuidv4(),
      label: "List Price",
      value: houseItem?.mlsListingPrice,
      currency: "USD",
    },
    {
      id: uuidv4(),
      label: "Estimated Price",
      value: houseItem?.estimatedValue,
      currency: "USD",
    },
    {
      id: uuidv4(),
      label: "Estimated Rent",
      value: houseItem?.rentAmount,
      currency: "USD",
    },
  ];

  const handleFetchImage = useCallback(async () => {
    if (
      !houseItem ||
      houseItem.image ||
      !houseItem.latitude ||
      !houseItem.longitude
    ) {
      setIsImageLoading(false);
      return;
    }

    setIsImageLoading(true);

    try {
      const { success, error } = await getStreetViewImage({
        location: `${houseItem.latitude},${houseItem.longitude}`,
        size: "600x600",
      });

      if (success) {
        setPropertyContext((prevContext) => {
          return prevContext.map((property) =>
            property.id === houseItem.id
              ? { ...property, image: success }
              : property
          );
        });
        setImageData(success);
      } else {
        console.error("Error fetching street view image:", error);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsImageLoading(false);
    }
  }, [houseItem, setPropertyContext]);

  useEffect(() => {
    handleFetchImage();
  }, [handleFetchImage, houseItem, imageData]);

  if (isLoading) {
    switch (variant) {
      case "skeleton-horizontal":
        return <HorizontalSkeleton />;
      default:
        return <Skeleton />;
    }
  }

  return (
    <>
      {variant === "default" ? (
        <div
          onClick={() => handleOnSelectHouse && handleOnSelectHouse(houseItem)}
          className={`cursor-pointer flex flex-col min-h-[27rem] border rounded-xl overflow-hidden pb-4 ${
            isSelected
              ? "shadow-lg outline outline-4 outline-primary border-none"
              : "shadow-sm hover:shadow-lg"
          }`}
          key={houseItem?.id}
        >
          <div className="shrink-0 basis-[45%] flex items-center justify-center bg-gray-100 rounded-t-xl">
          {houseItem?.image && !isImageLoading ? (
              <Image
                src={houseItem?.image}
                alt="property image"
                width={600}
                height={600}
                sizes="100%"
                priority
                className="w-full h-full aspect-video object-cover rounded-t-xl"
              />
            ) : (
              <ImageSekeleton />
            )}
          </div>
          <div className="basis-[100%] p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xl">
                $ {formatNumberWithCommas(houseItem?.estimatedValue ?? 0)}
              </span>
              <ShareSaveButton
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
              />
            </div>

            <div className="flex gap-2 text-[.8rem] whitespace-nowrap overflow-clip text-black/60">
              <p>{houseItem?.address.street},</p>
              <p>{houseItem?.address.city},</p>
              <p>{houseItem?.address.state} </p>
              <p>{houseItem?.address.zip}</p>
            </div>

            <div className="w-full">
              <div className="flex items-center flex-wrap w-full text-black/60">
                {propertyOverViewInfoItems.map((item) => (
                  <div
                    className="flex flex-row self-start min-w-full sm:min-w-[130px] bg-gray-100 gap-2 rounded-xl"
                    key={item.id}
                  >
                    {item.icon}
                    <div className="text-left flex flex-col">
                      <p className="text-xs">{item.value ?? "-"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="items-center basis-full text-black/60 gap-1">
              <ItemList
                baseWrapperClass="border-none flex"
                itemList={propertyAnalysis}
                rootWrapperClass="xl:grid-cols-1 xl:gap-1"
                variant="small"
              />
            </div>
          </div>
        </div>
      ) : variant === "horizontal" ? (
        <div className="bg-white shadow-md rounded-xl h-[17rem] w-full flex-shrink-0 mt-2 flex overflow-hidden">
          <div className="basis-4/5 flex items-center justify-center border-r">
            {(houseItem?.image || imageData) && !isImageLoading ? (
              <div className="relative w-full h-full">
                <Image
                  src={houseItem?.image ?? imageData ?? ""}
                  alt="property image"
                  width={600}
                  height={600}
                  sizes="100%"
                  priority
                  className="w-full h-full aspect-video object-cover rounded-l-xl"
                />
                <div className="flex flex-col justify-between gap-3 absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent w-full p-4">
                  <div className="text-[.8rem] text-white">
                    <p className="text-sm font-semibold">
                      {houseItem?.address.street}, {houseItem?.address.city},{" "}
                      {houseItem?.address.state} {houseItem?.address.zip}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center w-full text-white">
                    {propertyOverViewInfoItems.map((item) => (
                      <div className="flex gap-2" key={item.id}>
                        {item.icon}
                        <div className="text-left">
                          <p className="text-xs font-extralight">
                            {item.value ?? "-"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ImageSekeleton />
            )}
          </div>
          <div className="basis-full flex flex-col justify-between p-5">
            <div className="flex flex-col gap-4">
              <ItemList
                itemList={priceListItems}
                variant="small"
                rootWrapperClass="xl:grid-cols-3 xl:gap-1"
                baseWrapperClass="flex-col"
              />
              <ItemList
                baseWrapperClass="border-none flex"
                itemList={propertyAnalysis}
                rootWrapperClass="xl:grid-cols-1 xl:gap-2"
                variant="small"
              />
            </div>
            <div className="flex items-center justify-between">
              <ShareSaveButton
                className="flex-row-reverse"
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
              />
              <Button
                onClick={() =>
                  handleOnSelectHouse && handleOnSelectHouse(houseItem)
                }
                className="rounded-[.5rem]"
                size="sm"
              >
                View Listing
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

const HorizontalPropertyInfo = ({
  children,
}: {
  children: React.ReactNode;
}) => <p className="border-b flex justify-between w-full">{children}</p>;

export default HouseCard;

const ShareSaveButton = ({
  setIsFavorite,
  isFavorite,
  className,
}: {
  setIsFavorite: (fav: boolean) => void;
  isFavorite: boolean;
  className?: string;
}) => (
  <div className={`flex items-center basis-1/12 shrink-0 z-[99] ${className}`}>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
      }}
    >
      {isFavorite ? (
        <BookmarkFilledIcon className="w-6 h-6 text-yellow-500" />
      ) : (
        <BookmarkIcon className="w-6 h-6" />
      )}
    </button>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <PiShareFatBold className="w-6 h-6" />
    </button>
  </div>
);
