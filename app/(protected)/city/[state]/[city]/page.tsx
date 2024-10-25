"use client";
import type { PropertySearch } from "@/lib/definition";
import { usePathname } from "next/navigation";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { propertySearch } from "@/actions/property-search";
import handleApiSearchCall from "@/lib/api";
import { useSearchContext } from "@/context/search-context";
import MapsPriceView from "./_components/maps-price-view";
import HouseImageListing from "./_components/house-image-listing";
import TableComponent from "./[address]/home/[id]/_components/table-component";
import HouseCard from "./_components/house-card";
import { Button } from "@/components/ui/button";
import getValueByKey from "@/lib/functions/getValuesBykey";
import { ViewState } from "react-map-gl/dist/esm/types";
import { type TableHeaderType } from "@/lib/definition";

// filters
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CACHE_PREFIX } from "@/helpers/constants";

const tableListingsHeader: TableHeaderType[] = [
  {
    key: "score",
    label: "Score",
  },
  {
    key: "id",
    label: "",
  },
  {
    key: "address.street",
    label: "Address",
    sortable: true,
  },
  {
    key: "estimatedValue",
    label: "Price",
    sortable: true,
    secondKey: "priceHighToLow",
    thirdKey: "priceLowToHigh",
  },

  {
    key: "bedrooms",
    label: "Beds",
    sortable: true,
  },
  {
    key: "bathrooms",
    label: "Baths",
    sortable: true,
  },
  {
    key: "squareFeet",
    label: "Sq.Ft.",
    sortable: true,
  },
  {
    key: "pricePerSquareFoot",
    label: "$/Sq.Ft.",
    sortable: true,
  },
];

const DynamicCity = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"grid" | "table">("table");
  const { propertyContext, setPropertyContext } = useSearchContext();
  const [mapCenter, setMapCenter] = useState<ViewState>({
    longitude: 0,
    latitude: 0,
    zoom: 15,
    bearing: 0,
    padding: {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    },
    pitch: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<
    PropertySearch | undefined
  >(undefined);

  const { state, city } = useMemo(() => {
    const path = pathname
      ?.split("/")
      ?.filter((item) => item !== "" && item !== "city")
      ?.map((item) => item.replace(/-/g, " "));
    return {
      state: path?.[0] ?? null,
      city: path?.[1] ?? null,
    };
  }, [pathname]);

  const handlePropertySearch = useCallback(async () => {
    if (!state || !city) return;

    await handleApiSearchCall(
      propertySearch,
      { city, state, size: 30 },
      (result: PropertySearch[]) => {
        const mappedResult = result.map((item, index) => ({
          ...item,
          score: getRandomColor(),
          isActive: index === 0 ? true : false,
        }));
        setPropertyContext(mappedResult);
        setSelectedHouse(mappedResult[0] || undefined);
      },
      setLoading
    );

  }, [state, city, setPropertyContext, propertyContext]);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
    secondKey?: string;
    thirdKey?: string;
  } | null>(null);

  const getRandomColor = () => {
    const colors = ["#ef4444", "#f59e0b", "#22c55e"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const sortData = useMemo(() => {
    if (!sortConfig) return propertyContext;

    const { key, direction } = sortConfig;

    const sorted = [...propertyContext].sort((a, b) => {
      const aValue = getValueByKey(a, key);
      const bValue = getValueByKey(b, key);

      const handleNull = (value: number | string | null) =>
        value === null ? -Infinity : value;

      const aHandledValue = handleNull(aValue);
      const bHandledValue = handleNull(bValue);

      if (
        typeof aHandledValue === "string" &&
        typeof bHandledValue === "string"
      ) {
        return direction === "asc"
          ? aHandledValue.localeCompare(bHandledValue)
          : bHandledValue.localeCompare(aHandledValue);
      }

      return direction === "asc"
        ? (aHandledValue as number) - (bHandledValue as number)
        : (bHandledValue as number) - (aHandledValue as number);
    });

    return sorted;
  }, [propertyContext, sortConfig]);

  const sortedData = sortData;

  const handleOnSelectHouseOnMap = async (
    selected: PropertySearch | undefined
  ) => {
    setSelectedHouse(selected);
  };

  const handleOnSelectHouse = async (selected: PropertySearch | undefined) => {
    setSelectedHouse(selected);
    const street = selected?.address.street;
    const formattedStreet =
      street === "" ? "-" : street?.replace(/[\s,]+/g, "-");

    router.push(`${pathname}/${formattedStreet}/home/${selected?.id}`);
  };

  const handleSetActiveTab = (newActiveTab: "grid" | "table") => {
    setActiveTab(newActiveTab);
  };

  const onTableRowClick = (selected: PropertySearch) => {
    const index = propertyContext.findIndex((item) => item.id === selected.id);

    if (index > -1) {
      const propertyContextTemp = propertyContext.map((item, idx) => ({
        ...item,
        isActive: idx === index,
      }));
      setPropertyContext(propertyContextTemp);
    }

    setSelectedHouse(selected);
    const street = selected?.address.street;

    if (selected && selectedHouse) {
      if (selected.id === selectedHouse.id) {
        const formattedStreet =
          street === "" ? "-" : street?.replace(/[\s,]+/g, "-");
        router.push(`${pathname}/${formattedStreet}/home/${selected?.id}`);
      }
    }
  };

  const handleSortChange = (key: string) => {
    let newSortConfig = { key, direction: "desc" } as {
      key: string;
      direction: "asc" | "desc";
      secondKey?: string;
    };

    switch (key) {
      case "priceHighToLow":
        newSortConfig = {
          key: "estimatedValue",
          direction: "desc",
          secondKey: "priceHighToLow",
        };
        break;

      case "priceLowToHigh":
        newSortConfig = {
          key: "estimatedValue",
          direction: "asc",
          secondKey: "priceLowToHigh",
        };
        break;

      case "estimatedValue":
        if (
          sortConfig?.key === "estimatedValue" &&
          sortConfig.direction === "asc"
        ) {
          newSortConfig = {
            key: "estimatedValue",
            direction: "desc",
            secondKey: "priceHighToLow",
          };
        } else {
          newSortConfig = {
            key: "estimatedValue",
            direction: "asc",
            secondKey: "priceLowToHigh",
          };
        }
        break;

      default:
        newSortConfig = {
          key,
          direction:
            sortConfig?.key === key && sortConfig?.direction === "desc"
              ? "asc"
              : "desc",
        };
    }

    setSortConfig(newSortConfig);
  };

  const onSelectSort = (key: string) => {
    handleSortChange(key);
  };

  useEffect(() => {
    if (propertyContext.length > 0) return;
    handlePropertySearch();
  }, [handlePropertySearch]);

  return (
    <div className="flex h-full overflow-hidden">
      {/* left - maps */}
      <MapsPriceView
        handleOnSelectHouse={handleOnSelectHouseOnMap}
        selectedHouse={selectedHouse}
        setMapCenter={setMapCenter}
        mapCenter={mapCenter}
      />
      <div className="h-full shrink-0 basis-full lg:basis-[45%] xl:basis-[50%] 2xl:basis-[40%] 3xl:basis-[35%] flex flex-col overflow-y-auto bg-[#F4F4F4]">
        <div className="mt-2 overflow-y-scroll flex flex-col gap-2 px-6 grow shrink-0">
          <div className="w-full flex items-center justify-between p-1">
            <div className="flex gap-2 basis-[20%]">
              <Select>
                <SelectTrigger className="bg-white py-4 border border-gray-200 rounded-lg">
                  <SelectValue placeholder="For Sale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="filter1">filter</SelectItem>
                  <SelectItem value="filter2">filter</SelectItem>
                  <SelectItem value="filter3">filter</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="bg-white py-4 border border-gray-200 rounded-lg">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="filter1">filter</SelectItem>
                  <SelectItem value="filter2">filter</SelectItem>
                  <SelectItem value="filter3">filter</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="bg-white py-4 border border-gray-200 rounded-lg">
                  <SelectValue placeholder="Beds/Baths" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="filter1">filter</SelectItem>
                  <SelectItem value="filter2">filter</SelectItem>
                  <SelectItem value="filter3">filter</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="bg-white py-4 border border-gray-200 rounded-lg">
                  <SelectValue placeholder="Home Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="filter1">filter</SelectItem>
                  <SelectItem value="filter2">filter</SelectItem>
                  <SelectItem value="filter3">filter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex p-1 bg-sky-100 rounded-lg">
              <Button
                onClick={() => handleSetActiveTab("table")}
                size="sm"
                variant="ghost"
                className={`h-3 min-w-[4rem] p-3 hover:bg-transparent text-[14px] px-2 rounded-lg ${
                  activeTab === "table"
                    ? "bg-primary hover:bg-primary hover:text-white text-white"
                    : "text-black "
                }`}
              >
                Table
              </Button>
              <Button
                onClick={() => handleSetActiveTab("grid")}
                size="sm"
                variant="ghost"
                className={`h-3 min-w-[4rem] p-3 hover:bg-transparent text-[14px] px-2 rounded-lg ${
                  activeTab === "grid"
                    ? "bg-primary hover:bg-primary hover:text-white text-white"
                    : "text-black "
                }`}
              >
                Grid
              </Button>
            </div>
          </div>

          <Sort
            onSelectSort={onSelectSort}
            resultsLength={propertyContext?.length}
            sortConfig={sortConfig}
            hasSelectedHouse={selectedHouse ? true : false}
          />

          {selectedHouse && activeTab !== "grid" && (
            <HouseCard
              isLoading={loading}
              houseItem={selectedHouse}
              variant={loading ? "skeleton-horizontal" : "horizontal"}
              handleOnSelectHouse={handleOnSelectHouse}
            />
          )}
        </div>

        <div
          className={`${selectedHouse ? "order-2" : "order-1"} ${
            activeTab === "grid" ? "p-4 px-8" : ""
          } flex flex-col w-full h-full overflow-y-scroll `}
        >
          {activeTab === "grid" ? (
            <HouseImageListing
              selectedHouse={selectedHouse}
              loading={loading}
              handleOnSelectHouse={handleOnSelectHouse}
              propertyContext={sortedData}
            />
          ) : (
            <div className="overflow-y-auto h-full w-full">
              <TableComponent
                tableHeaderClass="sticky top-0"
                onRowItemClickAction={onTableRowClick}
                headers={tableListingsHeader}
                rows={sortedData}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* other contents */}
    </div>
  );
};

export default DynamicCity;

const Sort = ({
  resultsLength,
  sortConfig,
  onSelectSort,
  hasSelectedHouse,
}: {
  resultsLength: number;
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
    secondKey?: string;
    thirdKey?: string;
  } | null;
  onSelectSort: (selected: string) => void;
  hasSelectedHouse: boolean;
}) => (
  <div
    className={`w-full flex items-end justify-between my-2 ${
      hasSelectedHouse ? "order-2" : "order-1"
    }`}
  >
    <div className="flex items-center gap-4 w-1/2 px-1">
      <p className="text-sm shrink-0 font-bold text-primary">
        {resultsLength ?? 0} results
      </p>
      <span className="text-primary">&bull;</span>
      <div className="flex items-center gap-2 w-full">
        <p className="text-sm">Sort</p>
        <Select
          value={sortConfig?.secondKey ?? sortConfig?.key ?? "lastUpdateDate"}
          onValueChange={onSelectSort}
        >
          <SelectTrigger className="rounded-lg py-4 shadow-none focus:ring-0 w-2/3 bg-white border border-gray-200 ">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastUpdateDate">Newest</SelectItem>
            <SelectItem value="priceHighToLow">Price (high to low)</SelectItem>
            <SelectItem value="priceLowToHigh">Price (low to high)</SelectItem>
            <SelectItem value="squareFeet">Square Feet</SelectItem>
            <SelectItem value="pricePerSquareFoot">Price/sq.ft.</SelectItem>
            <SelectItem value="address.street">Address</SelectItem>
            <SelectItem value="bedrooms">Beds</SelectItem>
            <SelectItem value="bathrooms">Bathrooms</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);
