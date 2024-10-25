import React from "react";
import { type RentComparables, Comparable } from "@/lib/definition";
import GoogleMapsMarker from "../markers/google-maps-marker";
import MapNotAvailable from "../map-not-available";
import Image from "next/image";

interface RentComparableOverlayProps {
  comparableData?: RentComparables;
  activeRentComparable?: Comparable | undefined;
  handleSetActiveComparable: (item: Comparable) => void;
  onHoverAction: (
    selected: Comparable,
    mode: "blur" | "focus",
    location: "map" | "table"
  ) => void;
}

const RentComparableOverlay: React.FC<RentComparableOverlayProps> = ({
  comparableData,
  activeRentComparable,
  handleSetActiveComparable,
  onHoverAction,
}) => {
  if (comparableData?.comparables && !(comparableData?.comparables?.length > 0))
    return <MapNotAvailable />;

  return (
    <>
      {comparableData?.comparables?.map((item) => (
        <React.Fragment key={item.id}>
          {item.indicator === "current" ? (
            <GoogleMapsMarker
              position={{
                lat: item?.latitude || 0,
                lng: item?.longitude || 0,
              }}
              zIndex={item.id === activeRentComparable?.id ? 10 : 1}
            >
              <Image
                src="/images/custom-pin.svg"
                className="w-7 h-7 object-contain object-center"
                width={0}
                height={0}
                sizes="100%"
                alt="logo image"
              />
            </GoogleMapsMarker>
          ) : (
            <GoogleMapsMarker
              zIndex={item.id === activeRentComparable?.id ? 10 : 1}
              key={item.id}
              className="rounded-none"
              position={{
                lat: item?.latitude || 0,
                lng: item?.longitude || 0,
              }}
              onClick={() => handleSetActiveComparable(item)}
              onMouseEnter={() => onHoverAction(item, "focus", "map")}
              onMouseLeave={() => onHoverAction(item, "blur", "map")}
            >
              <p
                className={`h-8 w-8 rounded-full relative flex flex-col items-center justify-center font-bold ring-2 ring-white ${
                  activeRentComparable?.indicator === item.indicator
                    ? "bg-primary text-white"
                    : "bg-[#CAE9FF] text-primary"
                }`}
              >
                {item.indicator}
              </p>
            </GoogleMapsMarker>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default RentComparableOverlay;
