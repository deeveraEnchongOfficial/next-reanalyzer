import React from "react";
import Header from "./header";
import TagWrapper from "./tag/tag-wrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PropertyHistory from "./property/property-history";
import TableComponent from "./table-component";

const tagList = [
  { id: 1, content: "Tag 1" },
  { id: 2, content: "Tag 2" },
  { id: 3, content: "Tag 3" },
  { id: 4, content: "Tag 4" },
];

const headers = ["School", "Distance", "Rating"];
const rows = [
  ["INV001", "Paid", "Credit Card"],
  ["INV002", "Pending", "Paypal"],
  ["INV003", "Failed", "Bank Transfer"],
];

const PropertyDetails = () => {
  return (
    <div className="bg-white p-4 mt-4 rounded-xl">
      <Header header="Property Details" as="h1" />
      <p className="font-bold">MLS Description *if available</p>
      <p className="font-bold">Neighborhood*</p>
      <p>{`
      - propery info object
      -flood zone description
      - neighborhood`}</p>
      <p>- air conditioning</p>
      <p>- basement</p>
      <p>- land use</p>
      <p className="font-bold mt-4">Lot Info*</p>
      <p className="font-bold mt-4">Tags**</p>
      <TagWrapper tagList={tagList} />
      <p className="font-bold mt-4">School*</p>
      <TableComponent headers={headers} rows={rows} />
      <p className="font-bold mt-4">History*</p>
      <PropertyHistory />
    </div>
  );
};

export default PropertyDetails;
