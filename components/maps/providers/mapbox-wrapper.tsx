"use client";
import React from "react";
import Map, {
  Source,
  Layer,
  MapProps,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Geometry = {
  type:
    | "Point"
    | "LineString"
    | "Polygon"
    | "MultiPoint"
    | "MultiLineString"
    | "MultiPolygon"
    | "GeometryCollection";
  coordinates: number[][][] | number[][] | number[] | number;
};

type Properties = {
  name: string;
  density: number;
};

export type GeoJsonFeature = {
  type: "Feature";
  id: string | number;
  properties: Properties;
  geometry: Geometry;
};

interface MapboxWrapperProps {
  children?: React.ReactNode;
  zoom?: number;
  geoJsonData?: GeoJsonFeature | null;
  showErrorOverlay?: boolean;
}

type MapboxWrapperRestProps = Omit<
  MapProps,
  "children" | "projection" | "terrain" | "logoPosition"
>;

const MapboxWrapper: React.FC<MapboxWrapperRestProps & MapboxWrapperProps> = ({
  children,
  geoJsonData,
  showErrorOverlay,
  ...rest
}) => {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

  return (
    <Map
      {...rest}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={mapboxToken}
    >
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
      <ScaleControl />
      {geoJsonData && geoJsonData.type && (
        <Source id="alabama" type="geojson" data={geoJsonData}>
          <Layer
            id="alabama-fill"
            type="fill"
            paint={{
              "fill-color": "#888888",
              "fill-opacity": 0.4,
            }}
          />
          <Layer
            type="line"
            paint={{
              "line-color": "#000000",
              "line-width": 2,
            }}
          />
          <Layer
            type="symbol"
            layout={{
              "icon-size": 10,
              "text-field": ["get", "id"],
            }}
          />
        </Source>
      )}

      {showErrorOverlay ? (
        <div className="relative left-0 top-0 text-gray-400 flex items-center justify-center h-full w-full bg-black/30 z-[3]">
          <p className="absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] text-gray-300 text-lg italic">
            map not available.
          </p>
        </div>
      ) : (
        <>{children}</>
      )}
    </Map>
  );
};

export default React.memo(MapboxWrapper);
