import React, { useState } from "react";
import Header from "@/app/(protected)/client/_components/header";
import CalculationCard from "@/app/(protected)/client/_components/calculation-card";
import ChipsWrapper from "@/app/(protected)/client/_components/chips/chips-wrapper";
import ChipItem from "@/app/(protected)/client/_components/chips/chip-item";
import TableComponent from "@/app/(protected)/client/_components/table-component";

import { v4 as uuidv4 } from "uuid";

const calculateList = [
  { id: uuidv4(), label: "Down Pament (X%)", value: 100000 },
  { id: uuidv4(), label: "Closing Costs (3%)", value: 15000 },
  { id: uuidv4(), label: "Rehab Costs (3%)", value: 20000 },
];

const financialTabList = [
  { id: uuidv4(), label: "ALL", value: "all" },
  { id: uuidv4(), label: "Industry", value: "industry" },
  { id: uuidv4(), label: "Admin", value: "admin" },
  { id: uuidv4(), label: "IT", value: "it" },
  { id: uuidv4(), label: "Business", value: "business" },
  { id: uuidv4(), label: "Etc", value: "etc" },
];

const incomeTable = {
  tag: "income",
  headers: [
    "Income",
    "Year1",
    "Year2",
    "Year3",
    "year5",
    "year10",
    "Year20",
    "Year30",
  ],
  rows: [
    [
      "Gross Rent(Annual Increase%)",
      "$13,000",
      "$14,076",
      "$14,358",
      "$14,938",
      "$20,104",
      "$24,507",
    ],
    [
      "Vacancy",
      "$13,000",
      "$14,076",
      "$14,358",
      "$14,938",
      "$20,104",
      "$24,507",
    ],
    [
      "Other Incom",
      "$13,000",
      "$14,076",
      "$14,358",
      "$14,938",
      "$20,104",
      "$24,507",
    ],
    [
      "Operating Incom)",
      "$13,000",
      "$14,076",
      "$14,358",
      "$14,938",
      "$20,104",
      "$24,507",
    ],
  ],
};

const Financials = () => {
  const [financialActiveTab, setFinancialActiveTab] = useState(
    financialTabList[0].value
  );
  return (
    <div className="bg-white p-4 rounded-xl">
      <Header header="Finnancials" />
      <p className="font-bold mt-4">Cash Needed</p>
      <CalculationCard calculationList={calculateList} currency="USD" />
      <p className="font-bold mt-4">Tax Info*</p>
      <p className="font-bold mt-4">Last Sale**</p>

      <ChipsWrapper>
        {financialTabList.map((item) => (
          <ChipItem
            label={item.label}
            activeTab={financialActiveTab}
            setActiveTab={setFinancialActiveTab}
            compareStr={item.value}
            key={item.id}
          />
        ))}
      </ChipsWrapper>
      <TableComponent headers={incomeTable.headers} rows={incomeTable.rows} />
    </div>
  );
};

export default Financials;
