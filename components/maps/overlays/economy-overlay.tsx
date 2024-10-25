import React from "react";
import GooglePolygon from "../polygons/google-polygon";
import GoogleMapsMarker from "../markers/google-maps-marker";
import { useSearchContext } from "@/context/search-context";
import { formatNumberWithCommas } from "@/lib/functions/formatNumberWithCommas";
import MapNotAvailable from "../map-not-available";

interface EconomyOverlay {
  visible: boolean;
}

const EconomyOverlay: React.FC<EconomyOverlay> = ({ visible }) => {
  const { property, hasDeepDiveData } = useSearchContext();

  if (!hasDeepDiveData) return <MapNotAvailable />;
  return (
    <>
      <GooglePolygon
        visible={visible}
        place={{ place_id: property?.mapAndMarket?.map?.economy?.location?.place_id ?? "" }}
      />
      {visible ? (
        <GoogleMapsMarker
          position={{
            lat: property?.mapAndMarket?.map?.economy?.location?.lat ?? 0,
            lng: property?.mapAndMarket?.map?.economy?.location?.lng ?? 0,
          }}
        >
          <p className="text-xs rounded-full px-4 py-2 bg-white min-w-max font-bold text-center">
            {property?.mapAndMarket?.map?.economy?.info ?? ""}
          </p>
        </GoogleMapsMarker>
      ) : (
        <></>
      )}
    </>
  );
};

export default EconomyOverlay;
