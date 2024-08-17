"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";

const PropertyHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const data = useMemo(() => {
    return [
      {
        id: 1,
        label: "Under Contract",
        date: "January 15, 2024",
        value: "mls",
      },
      {
        id: 2,
        label: "Under Contract",
        date: "Febuary 10, 2024",
        value: "contract",
      },
      {
        id: 3,
        label: "Price Change",
        date: "January 11, 2024",
        value: "tax",
      },
      {
        id: 4,
        label: "Listed on MLS",
        date: "January 12, 2024",
        value: "mortgage",
      },
      {
        id: 5,
        label: "Under Contract",
        date: "January 13, 2024",
        value: "sales",
      },
    ];
  }, []);
  const filteredData = useMemo(() => {
    if (activeTab === "all") {
      return data;
    } else {
      return data.filter((item) => item.value.toLowerCase() === activeTab);
    }
  }, [activeTab, data]);
  return (
    <div className="w-full mx-auto my-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          onClick={() => setActiveTab("all")}
          className="px-4 py-2 rounded-full"
        >
          All
        </Button>
        <Button
          variant={activeTab === "mls" ? "default" : "outline"}
          onClick={() => setActiveTab("mls")}
          className="px-4 py-2 rounded-full"
        >
          MLS History
        </Button>
        <Button
          variant={activeTab === "contract" ? "default" : "outline"}
          onClick={() => setActiveTab("contract")}
          className="px-4 py-2 rounded-full"
        >
          Sales History
        </Button>
        <Button
          variant={activeTab === "sales" ? "default" : "outline"}
          onClick={() => setActiveTab("sales")}
          className="px-4 py-2 rounded-full"
        >
          Tax History
        </Button>
        <Button
          variant={activeTab === "tax" ? "default" : "outline"}
          onClick={() => setActiveTab("tax")}
          className="px-4 py-2 rounded-full"
        >
          Mortgage History
        </Button>
      </div>
      <Table>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.label}</TableCell>
              <TableCell>{item.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropertyHistory;
