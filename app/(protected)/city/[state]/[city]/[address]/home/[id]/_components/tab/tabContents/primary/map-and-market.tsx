import React, {
  useMemo,
  useState,
  useLayoutEffect,
  useRef,
  forwardRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import ChipsWrapper from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/chips/chips-wrapper";
import ChipItem from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/chips/chip-item";
import MarketTrendsChart from "../../../market-trends-chart";
import { useSearchContext } from "@/context/search-context";
import { formatNumberWithCommas } from "@/lib/functions/formatNumberWithCommas";
import ItemList from "../../item-list";

import MapsWrapper from "@/components/maps/maps-wrapper";

// overlays
import PopulationOverlay from "@/components/maps/overlays/population-overlay";
import EconomyOverlay from "@/components/maps/overlays/economy-overlay";
import RentComparableOverlay from "@/components/maps/overlays/rent-comparable-overlay";
import SaleComparisonOverlay from "@/components/maps/overlays/sale-comparison-overlay";

// components
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectGroup,
} from "@/components/ui/select";
import TitleDate from "@/components/title-date";
import { MapsAndMarketSkeleton } from "@/components/ui/skeletons";

import getLetterByIndex from "@/lib/functions/getLetterbyIndex";
import TableComponent from "../../../table-component";

// types
import { Comparable, SalesComparison } from "@/lib/definition";
import { DemographicsBlur } from "@/components/ui/blurred-components";

const mapChipItems = [
  // { id: uuidv4(), label: "Property", value: "property" },
  { id: uuidv4(), label: "Economy", value: "economy" },
  { id: uuidv4(), label: "Population Growth", value: "populationGrowth" },
  { id: uuidv4(), label: "Rent Comparables", value: "rentComparables" },
  { id: uuidv4(), label: "Sales Comparison", value: "salesComparison" },
];

const marketTrendItemsSecondLayer = [
  { id: uuidv4(), label: "Crime", value: "crime" },
  { id: uuidv4(), label: "Violent", value: "violent" },
  { id: uuidv4(), label: "Property", value: "property" },
];

const marketTrendItemsFirstLayer = [
  { id: uuidv4(), label: "Industry", value: "industry" },
  { id: uuidv4(), label: "Admin", value: "admin" },
  { id: uuidv4(), label: "IT", value: "it" },
  { id: uuidv4(), label: "Business", value: "business" },
  { id: uuidv4(), label: "Etc", value: "etc" },
];

const MapAndMarket = () => {
  const { property, hasDeepDiveData, isSearchLoading } = useSearchContext();
  const [mapChipActiveTab, setMapChipActiveTab] = useState(
    mapChipItems[0].value
  );
  const [firstChartLayer, setFirstChartLayer] = useState(
    marketTrendItemsFirstLayer[0].value
  );
  const [secondChartLayer, setSecondChartLayer] = useState(
    marketTrendItemsSecondLayer[0].value
  );
  const [mapCenter, setMapCenter] = useState({
    lng: 0,
    lat: 0,
  });
  const [zoom, setZoom] = useState(11);
  const [activeSalesComparison, setActiveSalesComparison] = useState<
    SalesComparison | undefined
  >(undefined);
  const [activeRentComparable, setActiveRentComparable] = useState<
    Comparable | undefined
  >(undefined);
  const [hoveredItem, setHoveredItem] = useState<
    SalesComparison | Comparable | undefined
  >(undefined);
  const scrollSalesComparisonRef = useRef<HTMLDivElement>(null);

  const demographicsList = useMemo(
    () => [
      {
        id: uuidv4(),
        label: "FMR Efficiency",
        value: formatNumberWithCommas(
          property?.mapAndMarket?.fmrEfficiency ?? "-"
        ),
      },
      {
        id: uuidv4(),
        label: "FMR One Bedroom",
        value: formatNumberWithCommas(
          property?.mapAndMarket?.fmrOneBedroom ?? "-"
        ),
      },
      {
        id: uuidv4(),
        label: "FMR Two Bedroom",
        value: formatNumberWithCommas(
          property?.mapAndMarket?.fmrTwoBedroom ?? "-"
        ),
      },
      {
        id: uuidv4(),
        label: "FMR Three Bedroom",
        value: formatNumberWithCommas(
          property?.mapAndMarket?.fmrThreeBedroom ?? "-"
        ),
      },
      {
        id: uuidv4(),
        label: "FMR Four Bedroom",
        value: formatNumberWithCommas(
          property?.mapAndMarket?.fmrFourBedroom ?? "-"
        ),
      },
      {
        id: uuidv4(),
        label: "Median Income",
        value: formatNumberWithCommas(
          property?.mapAndMarket?.medianIncome ?? "-"
        ),
      },
    ],
    [property]
  );

  const comparableMemo = useMemo(() => {
    const mappedComparables = property?.mapAndMarket?.rentComparables;
    return mappedComparables
      ? {
        ...mappedComparables,
        comparables:
          mappedComparables.comparables?.map((item, index) => ({
            ...item,
            indicator:
              item.id === property?.id
                ? "current"
                : getLetterByIndex(index - 1),
            isActive: item.id === activeRentComparable?.id,
          })) || [],
      }
      : undefined;
  }, [property, activeRentComparable?.id]);

  const salesComparisonMemo = useMemo(() => {
    const mappedSalesComparisons = [...(property?.mapAndMarket?.salesComparisons || [])];

    return (
      mappedSalesComparisons?.map((item, index) => ({
        ...item,
        indicator:
          item.id === property?.id ? "current" : getLetterByIndex(index - 1),
        isActive:
          item.id === hoveredItem?.id || item.id === activeRentComparable?.id,
      })) || []
    );
  }, [property?.mapAndMarket?.salesComparisons, activeSalesComparison?.id, hoveredItem]);

  const handleSetActiveComparison = (selected: SalesComparison | undefined) => {
    setActiveSalesComparison(selected);
  };

  const handleSetActiveComparable = (selected: Comparable | undefined) => {
    setActiveRentComparable(selected);
  };

  const handleHoverScrollTable = (
    id: number | string,
    location: "map" | "table"
  ) => {
    if (scrollSalesComparisonRef?.current && location === "map") {
      const targetElement = document.getElementById(`table-data-${id}`);

      if (targetElement) {
        const container = scrollSalesComparisonRef.current;

        const targetRect = targetElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const scrollPosition =
          targetRect.top -
          containerRect.top +
          container.scrollTop -
          containerRect.height / 1.5 +
          targetElement.offsetHeight / 1.5;

        container.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const handleSalesComparisonHoverAction = (
    item: SalesComparison | undefined,
    mode: "blur" | "focus",
    location: "map" | "table"
  ) => {
    if (mode === "blur") {
      return setHoveredItem(undefined);
    }

    setActiveSalesComparison(item);
    setHoveredItem(item);

    handleHoverScrollTable(item?.id || 0, location);
  };

  const handleRentComparableHoverAction = (
    item: Comparable | undefined,
    mode: "blur" | "focus",
    location: "map" | "table"
  ) => {
    if (mode === "blur") {
      return setHoveredItem(undefined);
    }

    setActiveRentComparable(item);
    setHoveredItem(item);

    handleHoverScrollTable(item?.id || 0, location);
  };

  const handleMapWrapperHoverAction = () => {
    setHoveredItem(undefined);
    setActiveRentComparable(undefined);
    setActiveSalesComparison(undefined);
  };

  const handleOnchangeChipTab = (active: string) => {
    if (!hasDeepDiveData) return;
    setMapChipActiveTab(active);
    if (active === "economy") {
      console.log(property?.mapAndMarket?.map?.economy?.location);
      setMapCenter({
        lng: property?.mapAndMarket?.map?.economy?.location?.lng || 0,
        lat: property?.mapAndMarket?.map?.economy?.location?.lat || 0,
      });
      setZoom(11);
    }
    else if (active === "populationGrowth") {
      setMapCenter({
        lng: property?.mapAndMarket?.map?.population?.location?.lng || 0,
        lat: property?.mapAndMarket?.map?.population?.location?.lat || 0,
      });
      setZoom(11);
    } else if (active === "rentComparables") {
      setMapCenter({
        lng: comparableMemo?.longitude || 0,
        lat: comparableMemo?.latitude || 0,
      });
      setZoom(11);
    }
  };

  // for population overlay lng lat only
  const [currentPropertyLat, currentPropertyLng] = useMemo(() => {
    // const lat = property?.populationBoundary?.geometry?.location?.lat ?? 0;
    // const lng = property?.populationBoundary?.geometry?.location?.lng ?? 0;
    const lat = property?.mapAndMarket?.map?.economy?.location?.lat ?? 0;
    const lng = property?.mapAndMarket?.map?.economy?.location?.lng ?? 0;
    return [lat, lng];
  }, [property?.mapAndMarket?.map]);

  if (isSearchLoading) {
    return <MapsAndMarketSkeleton />;
  }

  return (
    <div className="bg-white p-8 mt-4 rounded-xl">
      <TitleDate title="Maps and Market" />
      <div className="flex flex-col h-full">
        {hasDeepDiveData ? (
          <>
            <h3 className="font-bold text-xl">Demographics</h3>
            <ItemList itemList={demographicsList} />
          </>
        ) : (
          <DemographicsBlur />
        )}
      </div>

      {/* map overlay */}
      <p className="font-bold mt-4">Map Overlay</p>
      <ChipsWrapper>
        {mapChipItems.map((item) => (
          <ChipItem
            label={item.label}
            compareStr={item.value}
            key={item.id}
            activeTab={mapChipActiveTab}
            setActiveTab={handleOnchangeChipTab}
            disabled={!hasDeepDiveData || !property?.id}
            tootltipText="Please use deep dive."
          />
        ))}
      </ChipsWrapper>

      <div className="w-full">
        <MapsWrapper
          blurWrapper={true}
          onMapWrapperHoverAction={handleMapWrapperHoverAction}
          onBoundsChanged={(map) => setMapCenter(map.detail.center)}
          onZoomChanged={(map) => setZoom(map.detail.zoom)}
          center={{
            lat: mapCenter.lat || currentPropertyLat,
            lng: mapCenter.lng || currentPropertyLng,
          }}
          zoom={zoom}
          zoomControl
        >
          {/* overlays */}
          {mapChipActiveTab === "rentComparables" ? (
            <>
              <RentComparableOverlay
                comparableData={comparableMemo}
                handleSetActiveComparable={setActiveRentComparable}
                activeRentComparable={activeRentComparable}
                onHoverAction={handleRentComparableHoverAction}
              />
              <PopulationOverlay visible={false} />
            </>
          ) : mapChipActiveTab === "salesComparison" ? (
            <>
              <SaleComparisonOverlay
                handleSetActiveSalesComparison={setActiveSalesComparison}
                activeSalesComparison={activeSalesComparison}
                comparisonData={salesComparisonMemo}
                onHoverAction={handleSalesComparisonHoverAction}
              />
              <PopulationOverlay visible={false} />
            </>
          ) : mapChipActiveTab === "populationGrowth" ? (
            <PopulationOverlay
              visible={mapChipActiveTab === "populationGrowth"}
            />
          ) : mapChipActiveTab === "economy" ? (
            <EconomyOverlay
              visible={mapChipActiveTab === "economy"}
            />
          )
          : (
            <></>
          )}
        </MapsWrapper>
        {/* tables */}
        {mapChipActiveTab === "rentComparables" ? (
          <RentComparablesTable
            onSetActiveComparable={handleSetActiveComparable}
            onRowItemHoverAction={handleRentComparableHoverAction}
            rows={comparableMemo?.comparables || []}
            ref={scrollSalesComparisonRef}
          />
        ) : mapChipActiveTab === "salesComparison" ? (
          <SalesComparisonTable
            onRowItemHoverAction={handleSalesComparisonHoverAction}
            onSetActiveComparison={handleSetActiveComparison}
            rows={salesComparisonMemo || []}
            ref={scrollSalesComparisonRef}
          />
        ) : (
          <></>
        )}
      </div>

      <p className="font-bold mt-4">Market Trends*</p>
      <div className="flex items-center gap-2 my-4">
        <div className="rounded-xl">
          <Select
            onValueChange={(value) => setFirstChartLayer(value)}
            value={firstChartLayer}
            defaultValue="industry"
          >
            <SelectTrigger className="w-[180px] rounded-lg py-5">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="!py-4">
                {marketTrendItemsFirstLayer.map((item) => (
                  <SelectItem value={item.value} key={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Select
          onValueChange={(value) => setSecondChartLayer(value)}
          value={secondChartLayer}
          defaultValue="industry"
        >
          <SelectTrigger className="w-[180px] rounded-lg py-5">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {marketTrendItemsSecondLayer.map((item) => (
                <SelectItem value={item.value} key={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <MarketTrendsChart />
    </div>
  );
};

interface RentComparablesTableProps {
  rows: Comparable[];
  onSetActiveComparable?: (selected: Comparable | undefined) => void;
  onRowItemHoverAction: (
    selected: Comparable | undefined,
    mode: "blur" | "focus",
    location: "map" | "table"
  ) => void;
}
const RentComparablesTable = forwardRef<HTMLDivElement, RentComparablesTableProps>(
  ({ rows, onSetActiveComparable, onRowItemHoverAction }, ref) => {
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: "asc" | "desc";
    } | null>(null);

    const tableHeader = [
      {
        key: "indicator",
        label: "Indicator",
        tdClass: "flex items-center justify-center",
        thClass: "justify-center",
      },
      {
        key: "formattedAddress",
        label: "Address",
      },
      {
        key: "bedBath",
        label: "Bed/Bath",
      },
      {
        key: "squareFootage",
        label: "Sq ft",
      },
      {
        key: "correlation",
        label: "Similarity",
      },
      {
        key: "lotSize",
        label: "Lot Size",
      },
      {
        key: "yearBuilt",
        label: "Year Built",
      },
      {
        key: "lastSeenDate",
        label: "Last Seen Date",
      },
    ];

    const handleSortChange = (key: string) => {
      let direction: "asc" | "desc" = "asc";
      if (sortConfig?.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    };

    return (
      <div
        className="overflow-auto h-[15rem] w-full rounded-xl border shadow-md my-4"
        ref={ref}
      >
        <TableComponent
          blurWrapper={true}
          onRowItemClickAction={onSetActiveComparable}
          onRowItemHoverAction={onRowItemHoverAction}
          tableHeaderClass="whitespace-nowrap sticky top-0"
          sortConfig={sortConfig}
          onSortChange={handleSortChange}
          headers={tableHeader}
          rows={rows || []}
        />
      </div>
    );
  }
);
RentComparablesTable.displayName = "RentComparablesTable";

interface SalesComparisonTableProps {
  rows: SalesComparison[];
  onSetActiveComparison: (selected: SalesComparison) => void;
  onRowItemHoverAction: (
    selected: SalesComparison,
    mode: "blur" | "focus",
    location: "map" | "table"
  ) => void;
}

const SalesComparisonTable = forwardRef<HTMLDivElement, SalesComparisonTableProps>(
  ({ rows, onSetActiveComparison, onRowItemHoverAction }, ref) => {
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: "asc" | "desc";
    } | null>(null);

    const tableHeader = [
      {
        key: "indicator",
        label: "Indicator",
        tdClass: "flex items-center justify-center",
        thClass: "justify-center",
      },
      {
        key: "address.address",
        label: "Address",
      },
      {
        key: "bedBath",
        label: "Bed/Bath",
      },
      {
        key: "estimatedValue",
        label: "Estimated Value",
      },

      {
        key: "squareFeet",
        label: "Sq ft",
      },
      {
        key: "lastSaleAmount",
        label: "Last Sale Amount",
      },
      {
        key: "yearBuilt",
        label: "Year Built",
      },
      {
        key: "lastSaleDate",
        label: "Last Sale Date",
      },
    ];

    const handleSortChange = (key: string) => {
      let direction: "asc" | "desc" = "asc";
      if (sortConfig?.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    };

    return (
      <div
        className="overflow-auto h-[15rem] w-full rounded-xl border shadow-md my-4"
        ref={ref}
      >
        <TableComponent
          blurWrapper={true}
          onRowItemClickAction={onSetActiveComparison}
          onRowItemHoverAction={onRowItemHoverAction}
          tableHeaderClass="whitespace-nowrap sticky top-0"
          sortConfig={sortConfig}
          onSortChange={handleSortChange}
          headers={tableHeader}
          rows={rows || []}
        />
      </div>
    );
  }
);
SalesComparisonTable.displayName = "SalesComparisonTable";

export default MapAndMarket;
