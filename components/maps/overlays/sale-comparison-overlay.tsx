import React from "react";
import { type SalesComparison } from "@/lib/definition";
import GoogleMapsMarker from "../markers/google-maps-marker";
import MapNotAvailable from "../map-not-available";
import Image from "next/image";

interface SaleComarisonOverlayProps {
  comparisonData?: SalesComparison[];
  activeSalesComparison?: SalesComparison | undefined;
  handleSetActiveSalesComparison: (item: SalesComparison) => void;
  onHoverAction: (
    selected: SalesComparison,
    mode: "blur" | "focus",
    location: "map" | "table"
  ) => void;
}

const SaleComarisonOverlay: React.FC<SaleComarisonOverlayProps> = ({
  comparisonData,
  activeSalesComparison,
  handleSetActiveSalesComparison,
  onHoverAction,
}) => {
  if (comparisonData && !(comparisonData?.length > 0))
    return <MapNotAvailable />;
  return (
    <>
      {comparisonData?.map((item) => (
        <React.Fragment key={item.id}>
          {item.indicator === "current" ? (
            <GoogleMapsMarker
              zIndex={item.id === activeSalesComparison?.id ? 10 : 1}
              position={{
                lat: item?.latitude || 0,
                lng: item?.longitude || 0,
              }}
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
              zIndex={item.id === activeSalesComparison?.id ? 10 : 1}
              className="rounded-none"
              position={{
                lat: item?.latitude || 0,
                lng: item?.longitude || 0,
              }}
              onClick={() => handleSetActiveSalesComparison(item)}
              onMouseEnter={() => onHoverAction(item, "focus", "map")}
              onMouseLeave={() => onHoverAction(item, "blur", "map")}
            >
              <p
                className={`h-8 w-8 rounded-full relative flex flex-col items-center justify-center font-bold ring-2 ring-white ${
                  activeSalesComparison?.indicator === item.indicator
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

export default SaleComarisonOverlay;
