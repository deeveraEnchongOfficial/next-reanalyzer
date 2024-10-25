import React from "react";
import { AdvancedMarker, AdvancedMarkerProps } from "@vis.gl/react-google-maps";

interface GoogleMapsMarker {
  position: {
    lat: number;
    lng: number;
  };
  children?: React.ReactNode;
  className?: string;
}

type GoogleMapsMarkerRest = Omit<
  AdvancedMarkerProps,
  "position" | "children" | "className"
>;

const GoogleMapsMarker: React.FC<GoogleMapsMarker & GoogleMapsMarkerRest> = ({
  position,
  children,
  className,
  ...rest
}) => {
  return (
    <AdvancedMarker
      position={{ lat: Number(position.lat), lng: Number(position.lng) }}
      className={className}
      {...rest}
    >
      {children}
    </AdvancedMarker>
  );
};

export default React.memo(GoogleMapsMarker);
