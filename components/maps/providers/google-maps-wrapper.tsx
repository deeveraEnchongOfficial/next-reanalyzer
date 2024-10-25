import React from "react";
import { APIProvider, Map, MapProps } from "@vis.gl/react-google-maps";

interface MapsWrapperProps {
  children?: React.ReactNode;
  showErrorOverlay?: boolean;
  wrapperClass?: string;
}

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID;

const GoogleMapsWrapper: React.FC<MapsWrapperProps & MapProps> = ({
  showErrorOverlay,
  children,
  wrapperClass = "",
  ...rest
}) => {
  return (
    <div className={`h-96 ${wrapperClass}`}>
      <APIProvider apiKey={apiKey}>
        <Map
          style={{
            transition: "all",
            animationDuration: "300ms",
          }}
          className="relative h-full w-full"
          mapId={mapId}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          {...rest}
        >
          {showErrorOverlay ? (
            <div className="absolute left-0 top-0 text-gray-400 flex items-center justify-center h-full w-full bg-black/30 z-[3]">
              <p className="text-gray-300 text-lg italic">map not available.</p>
            </div>
          ) : (
            <>{children}</>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default GoogleMapsWrapper;
