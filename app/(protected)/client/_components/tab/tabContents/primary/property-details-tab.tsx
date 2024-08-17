import React from "react";
import Header from "@/app/(protected)/client/_components/header";
import TagWrapper from "@/app/(protected)/client/_components/tag/tag-wrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PropertyHistory from "@/app/(protected)/client/_components/property/property-history";

const tagList = [
  { id: 1, content: "Tag 1" },
  { id: 2, content: "Tag 2" },
  { id: 3, content: "Tag 3" },
  { id: 4, content: "Tag 4" },
];

const PropertyDetailsTab = () => {
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
      <Table className="p-4">
        <TableHeader className="p-4">
          <TableRow className="bg-primary hover:bg-primary text-white">
            <TableHead className="text-lg text-white">School</TableHead>
            <TableHead className="text-lg text-white">Distance</TableHead>
            <TableHead className="text-lg text-white">Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="font-bold mt-4">History*</p>
      <PropertyHistory />
    </div>
  );
};

export default PropertyDetailsTab;
