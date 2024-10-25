import React from "react";
import GooglePolygon from "../polygons/google-polygon";
import GoogleMapsMarker from "../markers/google-maps-marker";
import { useSearchContext } from "@/context/search-context";
import { formatNumberWithCommas } from "@/lib/functions/formatNumberWithCommas";
import MapNotAvailable from "../map-not-available";

interface PopulationOverlay {
  visible: boolean;
}

const PopulationOverlay: React.FC<PopulationOverlay> = ({ visible }) => {
  const { property, hasDeepDiveData } = useSearchContext();

  if (!hasDeepDiveData) return <MapNotAvailable />;
  return (
    <>
      <GooglePolygon
        visible={visible}
        place={{ place_id: property?.mapAndMarket?.map?.population?.location?.place_id || "" }}
      />

      {visible ? (
        <GoogleMapsMarker
          position={{
            lng: property?.mapAndMarket?.map?.population?.location?.lng || 0,
            lat: property?.mapAndMarket?.map?.population?.location?.lat || 0,
          }}
        >
          <p className="text-xs rounded-full px-4 py-2 bg-white min-w-max font-bold text-center">
            Pop:{" "}
            {formatNumberWithCommas(
              property?.mapAndMarket?.map?.population?.info?.latestPopulation  ?? 0
            )}{" "}
            ({property?.mapAndMarket?.map?.population?.info?.result ?? ""})
          </p>
        </GoogleMapsMarker>
      ) : (
        <></>
      )}
    </>
  );
};

export default PopulationOverlay;
