import React from "react";

const MapNotAvailable = () => {
  return (
    <div className="absolute left-0 top-0 text-gray-400 flex items-center justify-center h-full w-full bg-black/30 z-[3]">
      <p className="text-gray-300 text-lg italic">map not available.</p>
    </div>
  );
};

export default MapNotAvailable;
