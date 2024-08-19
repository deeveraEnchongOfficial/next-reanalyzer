import React from "react";
import { getCurrencySymbol } from "@/lib/functions/getCurrency";
import { formatNumberWithCommas } from "@/lib/functions/formatNumberWithCommas";
import {
  CrossCircledIcon,
  MinusCircledIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";

type Chip = {
  content?: string;
  sign?: "check" | "minus" | "x" | string | undefined;
};

interface ListItem {
  id: number | string;
  label: string;
  value?: number;
  currency?: string;
  extraValue?: string;
  chip?: Chip;
}

interface ItemListProps {
  itemList: ListItem[];
}

const ItemList: React.FC<ItemListProps> = ({ itemList }) => {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-1 lg:gap-4 w-full mt-2">
      {itemList.map((item) => (
        <div className="flex justify-between flex-col gap-1" key={item.id}>
          <p className="font-light shrink-0">{item.label}</p>
          <div className="text-base md:text-xl lg:text-2xl font-medium flex gap-1 flex-col lg:flex-row">
            {item.currency ? getCurrencySymbol(item.currency ?? "USD") : ""}
            {item.value ? formatNumberWithCommas(item.value) : ""}{" "}
            {item.extraValue}
            {item?.chip ? (
              <span
                className={`text-xs flex items-center gap-1 p-1 px-2 rounded-full font-light self-start lg:self-center w-fit ${
                  item?.chip?.sign === "x"
                    ? "bg-red-500 text-gray-100"
                    : item?.chip?.sign === "minus"
                    ? "bg-yellow-300 text-gray-700"
                    : "bg-green-300 text-gray-700"
                }`}
              >
                {item?.chip?.content}
                {item?.chip?.sign === "x" ? (
                  <CrossCircledIcon className="w-4 h-4" />
                ) : item?.chip?.sign === "minus" ? (
                  <MinusCircledIcon className="w-4 h-4" />
                ) : (
                  <CheckCircledIcon className="w-4 h-4" />
                )}
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
