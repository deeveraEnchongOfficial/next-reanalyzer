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
    <APIProvider apiKey={`AIzaSyCxldtEtqbjYcHc3NfjcEAI4zmiUSlD2M4`}>
      <Map
        className="rounded-xl h-full w-full"
        mapId={`17a19dedb84f7db1`}
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
