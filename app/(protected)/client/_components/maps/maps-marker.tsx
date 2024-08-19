import React from "react";
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

interface MapsMarker {
  position: {
    lat: number;
    lng: number;
  };
}

const MapsMarker: React.FC<MapsMarker> = ({ position }) => {
  return <AdvancedMarker position={position} />;
};

export default React.memo(MapsMarker);
