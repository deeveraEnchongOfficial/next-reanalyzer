export type GeoJSON = {
  type: string;
  id: string;
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
};

const convertToGeoJSON = (
  wkt: string,
  id: string,
  propertyName: string
): GeoJSON | null => {
  if (!wkt || typeof wkt !== "string") {
    return null;
  }

  try {
    const match = wkt.match(/POLYGON\s*\(\(\s*(.+?)\s*\)\)/i);
    if (!match) {
      console.error("WKT string is not a valid POLYGON");
      return null;
    }

    const coordinates = match[1]
      .split(", ")
      .map((point) => point.split(" ").map((coord) => parseFloat(coord)));

    const geoJSONCoordinates = [coordinates];

    const geoJSON: GeoJSON = {
      type: "Feature",
      id,
      properties: {
        density: 0,
        name: propertyName,
      },
      geometry: {
        type: "Polygon",
        coordinates: geoJSONCoordinates,
      },
    };

    return geoJSON;
  } catch (error) {
    console.error("Error converting WKT to GeoJSON:", error);
    return null;
  }
};

export default convertToGeoJSON;
