"use client";
import React from "react";
import { MapProps as GoogleMapProps } from "@vis.gl/react-google-maps";
import { MapProps as MapboxProps } from "react-map-gl";

// map providers
import GoogleMapsWrapper from "./providers/google-maps-wrapper";
import MapboxWrapper from "./providers/mapbox-wrapper";

import { Comparable, SalesComparison } from "@/lib/definition";

type MapProviders = "Google" | "Mapbox";

interface GoogleMapsWrapperProps extends Omit<GoogleMapProps, "children"> {}

type MapboxWrapperProps = Omit<
  MapboxProps,
  "children" | "projection" | "terrain" | "logoPosition"
>;

// combined wrapper props
interface BaseMapsWrapperProps {
  children?: React.ReactNode;
  defaultZoom?: number;
  showErrorOverlay?: boolean;
  provider?: MapProviders;
  center?: {
    lng: number;
    lat: number;
  };
  // blurWrapper means if the cursor leaves the wrapper, it would set the current active to undefined
  blurWrapper?: boolean;
  onMapWrapperHoverAction?: () => void;
}

// type conditionally based on provider
type MapsWrapperProps = BaseMapsWrapperProps &
  (
    | ({ provider?: "Google" } & GoogleMapsWrapperProps)
    | ({ provider?: "Mapbox" } & MapboxWrapperProps)
  );

const MapsWrapper: React.FC<MapsWrapperProps> = ({
  children,
  showErrorOverlay = false,
  provider = "Google",
  defaultZoom = 12,
  center,
  blurWrapper,
  onMapWrapperHoverAction,
  ...rest
}) => {
  switch (provider) {
    case "Google":
      return (
        <GoogleMapsWrapper
          defaultZoom={defaultZoom}
          showErrorOverlay={showErrorOverlay}
          center={{
            lat: Number(center?.lat) || 0,
            lng: Number(center?.lng) || 0,
          }}
          onMouseout={
            blurWrapper && onMapWrapperHoverAction
              ? onMapWrapperHoverAction
              : undefined
          }
          {...(rest as GoogleMapsWrapperProps)}
        >
          {children}
        </GoogleMapsWrapper>
      );
    case "Mapbox":
      return (
        <MapboxWrapper
          zoom={defaultZoom}
          showErrorOverlay={showErrorOverlay}
          {...(rest as MapboxProps)}
          onMouseLeave={
            blurWrapper && onMapWrapperHoverAction
              ? onMapWrapperHoverAction
              : undefined
          }
        >
          {children}
        </MapboxWrapper>
      );
    default:
      return null;
  }
};

export default React.memo(MapsWrapper);
