import React from "react";
import { Marker, type MarkerProps } from "react-map-gl";

interface MapsMarker {
  longitude: number;
  latitude: number;
  children?: React.ReactNode;
  className?: string;
}

type MapsMarkerRest = Omit<MarkerProps, "position" | "children" | "className">;

const MapboxMarker: React.FC<MapsMarker & MapsMarkerRest> = ({
  longitude,
  latitude,
  children,
  className,
  ...rest
}) => {
  return (
    <Marker
      {...rest}
      latitude={latitude}
      longitude={longitude}
      className={className}
      anchor="bottom"
    >
      {children}
    </Marker>
  );
};

export default MapboxMarker;
