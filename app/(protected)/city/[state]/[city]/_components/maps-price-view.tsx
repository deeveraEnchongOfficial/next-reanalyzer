"use client";
import React from "react";
import MapboxWrapper from "@/components/maps/providers/mapbox-wrapper";
import { formatNumberWithCommas } from "@/lib/functions/formatNumberWithCommas";
import { useSearchContext } from "@/context/search-context";
import type { PropertySearch } from "@/lib/definition";
import { ViewState } from "react-map-gl/dist/esm/types";
import MapboxMarker from "@/components/maps/markers/mapbox-marker";
import Image from "next/image";

interface MapsPriceViewProps {
  selectedHouse: PropertySearch | undefined;
  setMapCenter: React.Dispatch<React.SetStateAction<ViewState>>;
  mapCenter: ViewState;
  handleOnSelectHouse: (selected: PropertySearch | undefined) => void;
}

const MapsPriceView: React.FC<MapsPriceViewProps> = ({
  selectedHouse,
  setMapCenter,
  mapCenter,
  handleOnSelectHouse,
}) => {
  const { propertyContext } = useSearchContext();

  return (
    <div className="h-full basis-full hidden md:block">
      <MapboxWrapper
        {...mapCenter}
        latitude={mapCenter?.latitude || propertyContext[0]?.latitude || 0}
        longitude={mapCenter?.longitude || propertyContext[0]?.longitude || 0}
        onMove={(evt) => setMapCenter(evt.viewState)}
      >
        {propertyContext.map((item) => (
          <MapboxMarker
            onClick={() => handleOnSelectHouse(item)}
            key={item.id}
            className="rounded-none"
            latitude={item?.latitude || 0}
            longitude={item?.longitude || 0}
          >
            <div className="flex flex-col items-center">
              <span
                className={`${
                  selectedHouse && selectedHouse.id === item.id
                    ? "bg-red-700 after:border-t-red-900"
                    : "bg-green-700/40 after:border-t-green-900"
                } font-semibold text-white p-1 rounded-md relative z-10 
    `}
              >
                $ {formatNumberWithCommas(item.estimatedValue)}
              </span>

              <Image
                src={`${
                  selectedHouse && selectedHouse.id === item.id
                    ? "/images/custom-pin.svg"
                    : "/images/custom-pin-alt.svg"
                }`}
                className={`w-7 h-7 object-contain object-center -z-10 ${
                  selectedHouse && selectedHouse.id === item.id
                    ? "opacity-100"
                    : "opacity-40"
                }`}
                width="0"
                height="0"
                sizes="100%"
                alt="logo image"
              />
            </div>
          </MapboxMarker>
        ))}
      </MapboxWrapper>
    </div>
  );
};

export default React.memo(MapsPriceView);
