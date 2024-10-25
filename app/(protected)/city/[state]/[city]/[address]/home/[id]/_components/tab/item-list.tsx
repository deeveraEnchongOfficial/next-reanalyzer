import React from "react";
import { getCurrencySymbol } from "@/lib/functions/getCurrency";
import { formatNumberWithCommas } from "@/lib/functions/formatNumberWithCommas";
import { Cross1Icon, MinusIcon, CheckIcon } from "@radix-ui/react-icons";

type Chip = {
  content?: string;
  sign?: "check" | "minus" | "x" | string | undefined;
};

interface ListItem {
  id: number | string;
  label: string;
  value?: number | string | null;
  currency?: string;
  extraValue?: string;
  chip?: Chip;
}

interface ItemListProps {
  itemList: ListItem[];
  baseWrapperClass?: string;
  rootWrapperClass?: string;
  variant?: string;
}

const ItemList: React.FC<ItemListProps> = ({
  itemList,
  baseWrapperClass,
  rootWrapperClass,
  variant = "default",
}) => {
  return (
    <>
      {variant === "default" ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1 lg:gap-4 w-full mt-2 ${rootWrapperClass}`}
        >
          {itemList.map((item) => (
            <div
              className={`flex justify-between flex-col gap-1 ${baseWrapperClass}`}
              key={item.id}
            >
              <p className="font-light shrink-0">{item.label}</p>
              <div className="justify-between text-base md:text-xl lg:text-2xl font-medium items-center sm:items-start flex gap-1 sm:flex-col lg:flex-row">
                {item.currency && item.value
                  ? getCurrencySymbol(item.currency ?? "USD")
                  : ""}
                {typeof item.value === "string"
                  ? item.value
                  : typeof item.value === "number"
                  ? formatNumberWithCommas(item.value)
                  : "-"}{" "}
                {item.extraValue}
                {item?.chip ? (
                  <span
                    className={`text-xs flex items-center gap-1 rounded-full font-light self-start lg:self-center w-fit p-2 ${
                      item?.chip?.sign === "x"
                        ? "bg-red-500 text-gray-100"
                        : item?.chip?.sign === "minus"
                        ? "bg-yellow-400 text-gray-700"
                        : "bg-green-400 text-gray-700"
                    }`}
                  >
                    {item?.chip?.content}
                    {item?.chip?.sign === "x" ? (
                      <Cross1Icon className="w-7 h-7 text-white" />
                    ) : item?.chip?.sign === "minus" ? (
                      <MinusIcon className="w-7 h-7 text-white" />
                    ) : (
                      <CheckIcon className="w-7 h-7 text-white" />
                    )}
                  </span>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${rootWrapperClass}`}>
          {itemList.map((item) => (
            <div
              className={`flex justify-between gap-1 ${baseWrapperClass}`}
              key={item.id}
            >
              <p className="font-light shrink-0 text-xs">{item.label}</p>
              <div className="flex justify-between items-center text-xs gap-2 font-semibold">
                {item.currency && item.value
                  ? getCurrencySymbol(item.currency ?? "USD")
                  : ""}
                {typeof item.value === "string"
                  ? item.value
                  : typeof item.value === "number"
                  ? formatNumberWithCommas(item.value)
                  : "-"}{" "}
                {item.extraValue}
                {item?.chip ? (
                  <span
                    className={`text-xs flex items-center gap-1 rounded-full font-light self-start lg:self-center w-fit p-1 ${
                      item?.chip?.sign === "x"
                        ? "bg-red-500 text-gray-100"
                        : item?.chip?.sign === "minus"
                        ? "bg-yellow-400 text-gray-700"
                        : "bg-green-400 text-gray-700"
                    }`}
                  >
                    {item?.chip?.content}
                    {item?.chip?.sign === "x" ? (
                      <Cross1Icon className="w-3 h-3 text-white" />
                    ) : item?.chip?.sign === "minus" ? (
                      <MinusIcon className="w-3 h-3 text-white" />
                    ) : (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </span>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ItemList;
