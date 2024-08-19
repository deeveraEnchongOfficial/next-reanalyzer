import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

interface MapsWrapperProps {
  children?: React.ReactNode;
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

const MapsWrapper: React.FC<MapsWrapperProps> = ({
  children,
  center,
  zoom = 10,
}) => {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        className="rounded-xl h-full w-full"
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {children}
      </Map>
    </APIProvider>
  );
};

export default React.memo(MapsWrapper);
