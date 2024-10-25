import React, { useState } from "react";
import CalculationCard from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/calculation-card";
import ChipsWrapper from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/chips/chips-wrapper";
import ChipItem from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/chips/chip-item";
import TableComponent from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/table-component";
import { proFormula } from "@/lib/functions/proFormula";
import { v4 as uuidv4 } from "uuid";
import TitleDate from "@/components/title-date";
import { useSearchContext } from "@/context/search-context";
import type { TableHeaderType } from "@/lib/definition";
import { FinancialsSkeleton } from "@/components/ui/skeletons";

import { TableComponentBlur } from "@/components/ui/blurred-components";

const calculateList = [
  { id: uuidv4(), label: "Down Pament (X%)", value: 100000 },
  { id: uuidv4(), label: "Closing Costs (3%)", value: 15000 },
  { id: uuidv4(), label: "Rehab Costs (3%)", value: 20000 },
];

const generateHeaders = (title: string, years: number): TableHeaderType[] => {
  const headers = [
    {
      label: title,
      key: "metric",
      sortable: false,
      tdClass: "w-[25%]",
    },
  ] as TableHeaderType[];

  for (let year = 1; year <= years; year++) {
    headers.push({
      label: `Year ${year}`,
      key: `year${year}`,
      sortable: false,
      render: (row: any) => <div>{row[`year${year}`]}</div>,
    });
  }

  return headers;
};

const getFilteredRows = (
  metrics: { metric: string; key: string }[],
  allRows: any[]
): { metric: string; [key: string]: string | boolean }[] => {
  return metrics.map(({ metric, key }, index) => {
    const row: { metric: string; [key: string]: string | boolean } = { metric };

    const yearResult = allRows.find((result) => result.metric === key);
    if (yearResult) {
      Object.keys(yearResult).forEach((k) => {
        if (k.startsWith("year")) {
          row[k] = yearResult[k];
        }
      });
    }

    if (index === metrics.length - 1) {
      row["isActive"] = true;
    } else {
      row["isActive"] = false;
    }

    return row;
  });
};

const numberOfYears = 5;

const incomeMetrics = [
  { metric: "Gross rent(annual increase%)", key: "grossRent" },
  { metric: "Vacancy", key: "vacancy" },
  { metric: "Other income", key: "otherIncome" },
  { metric: "Operating income", key: "operatingIncome" },
];

const expensesMetrics = [
  { metric: "Property taxes", key: "propertyTaxes" },
  { metric: "Insurance", key: "insurance" },
  { metric: "Property management", key: "propertyManagement" },
  { metric: "Operating expenses", key: "operatingExpenses" },
];

const cashFlowMetrics = [
  { metric: "Net operating income", key: "netOperatingIncome" },
  { metric: "Loan payments", key: "loanPayments" },
  { metric: "Cash flow", key: "cashFlow" },
];

const Financials = () => {
  const { propertyDetailsContext, isSearchLoading, hasDeepDiveData } =
    useSearchContext();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const incomeHeaders = generateHeaders("Income", numberOfYears);
  const expensesHeaders = generateHeaders("Expenses", numberOfYears);
  const cashFlowHeaders = generateHeaders("Cash Flow", numberOfYears);

  const rows = proFormula(
    numberOfYears,
    isNaN(Number(propertyDetailsContext?.demographics?.suggestedRent) * 12)
      ? 1000
      : Number(propertyDetailsContext?.demographics?.suggestedRent) * 12,
    500
  );

  const incomeRows = getFilteredRows(incomeMetrics, rows);
  const expensesRows = getFilteredRows(expensesMetrics, rows);
  const cashFlowRows = getFilteredRows(cashFlowMetrics, rows);

  const incomeTable = {
    headers: incomeHeaders,
    rows: incomeRows,
  };

  const expensesTable = {
    headers: expensesHeaders,
    rows: expensesRows,
  };

  const cashFlowTable = {
    headers: cashFlowHeaders,
    rows: cashFlowRows,
  };

  const financialTableList = [
    { id: uuidv4(), label: "All", value: "all", tableData: undefined },
    { id: uuidv4(), label: "Income", value: "income", tableData: incomeTable },
    {
      id: uuidv4(),
      label: "Expenses",
      value: "expenses",
      tableData: expensesTable,
    },
    {
      id: uuidv4(),
      label: "Cashflow",
      value: "cashFlow",
      tableData: cashFlowTable,
    },
  ];

  const [financialActiveTab, setFinancialActiveTab] = useState(
    financialTableList[0].value
  );

  const handleSortChange = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (isSearchLoading) {
    return <FinancialsSkeleton />;
  }

  return (
    <div className="bg-white mt-4 rounded-xl p-8">
      <TitleDate title="Financials" />
      <p className="font-bold mt-4">Cash Needed</p>
      <CalculationCard calculationList={calculateList} currency="USD" />

      <TitleDate title="Proforma" hasDeepDived={hasDeepDiveData} />

      <ChipsWrapper>
        {financialTableList.map((item) => (
          <ChipItem
            label={item.label}
            activeTab={financialActiveTab}
            setActiveTab={setFinancialActiveTab}
            compareStr={item.value}
            key={item.id}
          />
        ))}
      </ChipsWrapper>

      {/* tables */}
      {hasDeepDiveData ? (
        <>
          {financialActiveTab === "all"
            ? financialTableList
                .filter((item) => item.value !== "all")
                .map(
                  (item) =>
                    item.tableData && (
                      <FinancialTable
                        key={item.id}
                        handleSortChange={handleSortChange}
                        sortConfig={sortConfig}
                        tableData={item.tableData}
                      />
                    )
                )
            : financialTableList.map(
                (item) =>
                  financialActiveTab === item.value &&
                  item.tableData && (
                    <FinancialTable
                      key={item.id}
                      handleSortChange={handleSortChange}
                      sortConfig={sortConfig}
                      tableData={item.tableData}
                    />
                  )
              )}
        </>
      ) : (
        <>
          {financialActiveTab === "all"
            ? financialTableList
                .filter((item) => item.value !== "all")
                .map(
                  (item) =>
                    item.tableData && (
                      <TableComponentBlur
                        key={item.id}
                        headers={item.tableData.headers}
                        rows={item.tableData.rows}
                      />
                    )
                )
            : financialTableList.map(
                (item) =>
                  financialActiveTab === item.value &&
                  item.tableData && (
                    <TableComponentBlur
                      key={item.id}
                      headers={item.tableData.headers}
                      rows={item.tableData.rows}
                    />
                  )
              )}
        </>
      )}
    </div>
  );
};

export default Financials;

interface FinancialTableProps {
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  } | null;
  handleSortChange: (key: string) => void;
  tableData:
    | {
        headers: TableHeaderType[];
        rows: { [key: string]: string | boolean; metric: string }[];
      }
    | undefined;
}

const FinancialTable: React.FC<FinancialTableProps> = ({
  sortConfig,
  handleSortChange,
  tableData,
}) => {
  const tableWrapperClass =
    "overflow-auto h-full w-full rounded-xl border shadow-md mb-4";

  return (
    <>
      {tableData?.rows ? (
        <div className={tableWrapperClass}>
          <TableComponent
            tableHeaderClass="whitespace-nowrap"
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
            headers={tableData?.headers || []}
            rows={tableData?.rows || []}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
