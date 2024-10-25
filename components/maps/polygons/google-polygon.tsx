import { useMap } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect } from "react";

type GooglePolygonProps = google.maps.places.PlaceResult;

const GooglePolygon: React.FC<{
  place: GooglePolygonProps;
  visible?: boolean;
}> = ({ place, visible = true }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;

    const placeId = place?.place_id;

    if (visible) {
      colorFeatureLayer(placeId, google.maps.FeatureType.POSTAL_CODE);
      colorFeatureLayer(placeId, google.maps.FeatureType.LOCALITY);
      colorFeatureLayer(placeId, google.maps.FeatureType.SCHOOL_DISTRICT);
    } else {
      clearFeatureLayerStyles(google.maps.FeatureType.POSTAL_CODE);
      clearFeatureLayerStyles(google.maps.FeatureType.LOCALITY);
      clearFeatureLayerStyles(google.maps.FeatureType.SCHOOL_DISTRICT);
    }
  }, [map, place, visible]);

  const colorFeatureLayer = (placeId: unknown, featureLayerName: string) => {
    //@ts-ignore
    const featureLayer = map?.getFeatureLayer(featureLayerName);

    //@ts-ignore
    const featureStyleOptions: google.maps.FeatureStyleOptions = {
      strokeColor: "#810fcb",
      strokeOpacity: 1.0,
      strokeWeight: 3.0,
      fillColor: "#810fcb",
      fillOpacity: 0.4,
    };

    //@ts-ignore
    featureLayer.style = (options: { feature: { placeId: string } }) => {
      if (options.feature.placeId == placeId) {
        return featureStyleOptions;
      }
    };
  };

  const clearFeatureLayerStyles = useCallback(
    (featureLayerName: string) => {
      //@ts-ignore
      const featureLayer = map?.getFeatureLayer(featureLayerName);

      if (featureLayer) {
        featureLayer.style = null;
      }
    },
    [map]
  );

  return null;
};

export default React.memo(GooglePolygon);
