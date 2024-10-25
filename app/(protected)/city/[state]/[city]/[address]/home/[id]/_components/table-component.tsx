import React, { ForwardedRef, forwardRef, LegacyRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { TableHeaderType } from "@/lib/definition";
import { formatNumberWithCommas } from "@/lib/functions/formatNumberWithCommas";
import { format } from "date-fns";
import Image from "next/image";
import { convertToPercentage } from "@/lib/utils";

interface TableComponentProps<T> {
  headers: TableHeaderType[];
  rows: T[];
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  onSortChange: (key: string) => void;
  onRowItemClickAction?: (selected: T | undefined) => void;
  onRowItemHoverAction?: (
    item: T | undefined,
    mode: "blur" | "focus",
    location: "map" | "table"
  ) => void;
  // blurWrapper means if the cursor leaves the wrapper, it would set the current active to undefined
  blurWrapper?: Boolean;
  tableHeaderClass?: string;
}

const getValueByKey = <T extends Record<string, any>>(
  obj: T,
  key: string
): any => {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const TableComponent = forwardRef<HTMLTableElement, TableComponentProps<any>>(
  (
    {
      headers,
      rows,
      sortConfig,
      onSortChange,
      onRowItemClickAction,
      onRowItemHoverAction,
      tableHeaderClass,
      blurWrapper = false,
    },
    ref
  ) => {
    return (
      <Table
        ref={ref}
        onMouseLeave={
          blurWrapper && onRowItemHoverAction
            ? () => onRowItemHoverAction(undefined, "blur", "table")
            : undefined
        }
      >
        <TableHeader className={tableHeaderClass}>
          <TableRow className="text-white bg-primary hover:bg-primary">
            {headers.map(
              (header, index) =>
                header.label.trim() && (
                  <TableHead
                    key={index}
                    className={`text-sm text-white ${
                      header.sortable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => header.sortable && onSortChange(header.key)}
                  >
                    <span
                      className={`flex gap-1 items-center  ${
                        headers[index]?.thClass || ""
                      }`}
                    >
                      {header.label}
                      {header.sortable && sortConfig?.key === header.key && (
                        <ArrowUpIcon
                          className={
                            sortConfig.direction === "desc" ? "rotate-180" : ""
                          }
                        />
                      )}
                    </span>
                  </TableHead>
                )
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="rounded-md border-border w-full h-10 overflow-clip relative">
          {rows?.length ? (
            rows?.map((row, rowIndex) => {
              const filteredRow = headers
                .filter((header) => header.label.trim())
                .map((header) =>
                  header.render ? (
                    header.render(row, rowIndex)
                  ) : header?.key === "estimatedValue" ? (
                    getValueByKey(
                      {
                        ...row,
                        estimatedValue: `$${formatNumberWithCommas(
                          Number(row["estimatedValue"])
                        )}`,
                      },
                      header.key
                    )
                  ) : header?.key === "score" ? (
                    <p
                      className="h-5 w-5 rounded-full mx-auto"
                      style={{ background: row["score"] }}
                    />
                  ) : header?.key === "lastSaleAmount" ? (
                    <p>{`$${formatNumberWithCommas(
                      Number(row["lastSaleAmount"])
                    )}`}</p>
                  ) : header?.key === "indicator" ? (
                    <>
                      {row["indicator"] === "current" ? (
                        <Image
                          src="/images/custom-pin.svg"
                          className="w-8 h-8 object-contain object-center"
                          width={32}
                          height={32}
                          sizes="100%"
                          alt="logo image"
                        />
                      ) : (
                        <p
                          className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                            row["isActive"]
                              ? "bg-primary text-white"
                              : "bg-[#CAE9FF] text-primary"
                          }`}
                        >
                          {row["indicator"]}
                        </p>
                      )}
                    </>
                  ) : header?.key === "bedBath" ? (
                    <p>
                      {row["bedrooms"]}/{row["bathrooms"]}
                    </p>
                  ) : header?.key === "lastSeenDate" ? (
                    <p>
                      {row["lastSeenDate"] !== null
                        ? format(new Date(row["lastSeenDate"]), "yyyy-MM-dd")
                        : "-"}
                    </p>
                  ) : header?.key === "lastSaleDate" ? (
                    <p>
                      {row["lastSaleDate"] !== null
                        ? format(new Date(row["lastSaleDate"]), "yyyy-MM-dd")
                        : "-"}
                    </p>
                  ) : header?.key === "correlation" ? (
                    <p>{convertToPercentage(row["correlation"])}</p>
                  ) : (
                    getValueByKey(row, header.key)
                  )
                );

              if (filteredRow.length === 0) {
                return null;
              }

              return (
                <TableRow
                  id={`table-data-${row["id"]}`}
                  onClick={
                    onRowItemClickAction &&
                    onRowItemHoverAction &&
                    row["indicator"] !== "current"
                      ? () => onRowItemClickAction(row)
                      : undefined
                  }
                  key={rowIndex}
                  style={{
                    cursor: onRowItemClickAction ? "pointer" : "default",
                  }}
                  className={`whitespace-normal hover:bg-primary/30 ${
                    row["isActive"] && row["indicator"] !== "current"
                      ? "bg-primary/30"
                      : ""
                  } `}
                  onMouseOver={
                    onRowItemHoverAction && row["indicator"] !== "current"
                      ? () => onRowItemHoverAction(row, "focus", "table")
                      : undefined
                  }
                  onMouseLeave={
                    onRowItemHoverAction && row["indicator"] !== "current"
                      ? () => onRowItemHoverAction(row, "blur", "table")
                      : undefined
                  }
                >
                  {filteredRow.map((cell, cellIndex) => {
                    return (
                      <TableCell
                        key={cellIndex}
                        className={`text-xs py-4 truncate ${
                          cellIndex === 0 ? "font-medium" : ""
                        } ${headers[cellIndex]?.tdClass || ""}`}
                      >
                        {cell || "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <tr>
              <td colSpan={99}>
                <div className="flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14">
                  <span
                    className="iconify i-heroicons:circle-stack-20-solid w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4"
                    aria-hidden="true"
                  ></span>
                  <p className="text-sm text-center text-gray-400">No items.</p>
                </div>
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    );
  }
);

TableComponent.displayName = "TableComponent";

export default TableComponent;
