import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CardContent } from "./card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AiFillLock } from "react-icons/ai";
import { IoIosInformationCircle } from "react-icons/io";

import { TableHeaderType } from "@/lib/definition";

const strToBlur = "abcdefghijk";

function TootltipInfo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="cursor-default">
            <IoIosInformationCircle className="h-5 w-5 text-primary" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="w-80 p-0 bg-white border border-gray-200 shadow-lg overflow-visible"
        >
          <div className="tooltip">
            <h3 className="text-primary font-semibold text-left text-lg">
              Lorem ipsum
            </h3>
            <p className="text-gray-600 text-sm text-left">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec
              odio. Quisque volutpat mattis eros. Nullam malesuada erat ut
              turpis. Suspendisse urna nibh viverra non semper suscipit posuere
              a pede. Donec nec justo eget felis facilisis fermentum. Aliquam
              porttitor mauris sit amet orci. Aenean dignissim pellentesque
              felis.
            </p>
            <div className="tooltip-arrow"></div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TitleBlur({ title }: { title?: string }) {
  return (
    <div className="flex items-center gap-2">
      {title ? <h4 className="font-bold text-xl">{title}</h4> : <></>}
      <div className="flex items-end">
        <AiFillLock className="h-5 w-5 text-primary" />
        <TootltipInfo />
      </div>
    </div>
  );
}

export function DemographicsBlur() {
  return (
    <div className="flex flex-col">
      <TitleBlur title="Demographics" />
      <div className={`flex gap-10`}>
        <div>
          <p className="font-light shrink-0 text-gray-400">
            Median Household Income
          </p>
          <div className="justify-between text-base md:text-xl lg:text-2xl font-medium items-center sm:items-start flex gap-1 sm:flex-col lg:flex-row blur-md noselect">
            {strToBlur}
          </div>
        </div>
        <div>
          <p className="font-light shrink-0 text-gray-400">City Population</p>
          <div className="justify-between text-base md:text-xl lg:text-2xl font-medium items-center sm:items-start flex gap-1 sm:flex-col lg:flex-row blur-md noselect">
            {strToBlur}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OwnerInfoBlur() {
  return (
    <CardContent className="p-4 grid grid-cols-2 gap-2">
      <div className="bg-gray-50 p-4 rounded-xl border">
        <p className="text-gray-500">Company Name</p>
        <p className="font-medium blur-md noselect">{strToBlur}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-xl border">
        <p className="text-gray-500">Address</p>
        <p className="font-medium blur-md noselect"> {strToBlur}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-xl border">
        <p className="text-gray-500">Owner Type</p>
        <p className="font-medium blur-md noselect"> {strToBlur}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-xl border">
        <p className="text-gray-500">Owner Occupied</p>
        <p className="font-medium blur-md noselect">{strToBlur}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-xl border">
        <p className="text-gray-500">Absentee Owner</p>
        <p className="font-medium blur-md">{strToBlur}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-xl border">
        <p className="text-gray-500">Ownership Length</p>
        <p className="font-medium blur-md noselect">{strToBlur}</p>
      </div>
    </CardContent>
  );
}

interface TableComponentBlurProps<T extends Record<string, any>> {
  headers: TableHeaderType[];
  rows: T[];
}

export const TableComponentBlur = <T extends Record<string, any>>({
  headers,
  rows,
}: TableComponentBlurProps<T>) => {
  return (
    <div className="overflow-auto h-full w-full rounded-xl border shadow-md mb-4">
      <Table className="w-full border border-gray-300">
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary">
            {headers.map((header, index) => (
              <TableHead key={index}>
                <span className="text-white">{header.label}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="rounded-md border-border w-full h-10 overflow-clip relative">
          {rows.map((row, rowIndex) => (
            <TableRow
              className={`whitespace-normal hover:bg-primary/30 noselect ${
                row["isActive" as keyof T] ? "bg-primary/30" : ""
              } `}
              key={rowIndex}
            >
              {headers.map((header, cellIndex) =>
                cellIndex > 0 ? (
                  <TableCell
                    key={cellIndex}
                    className={`${headers[cellIndex]?.tdClass || ""} blur-sm`}
                  >
                    {strToBlur}
                  </TableCell>
                ) : (
                  <TableCell
                    className={`${headers[cellIndex]?.tdClass || ""}`}
                    key={cellIndex}
                  >
                    {row[header.key]}
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
