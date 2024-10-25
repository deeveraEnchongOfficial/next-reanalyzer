import React from "react";
import { getCurrencySymbol } from "@/lib/functions/getCurrency";
import { formatNumberWithCommas } from "@/lib/functions/formatNumberWithCommas";
import Divider from "@/components/divider";

type CalculationItem = {
  id: string | number;
  label: string;
  value: number;
};

interface CalculationCardProps {
  calculationList: CalculationItem[];
  currency: string;
}

const getTotal = (num: CalculationItem[]) => {
  return num.reduce((acc, current) => acc + current["value"], 0);
};

const CalculationCard: React.FC<CalculationCardProps> = ({
  calculationList,
  currency,
}) => {
  return (
    <div className="bg-white roudned-xl shadow-sm border rounded-xl p-4 mb-8">
      {calculationList.map((item) => (
        <div
          className="w-full flex justify-between items-center my-4"
          key={item.id}
        >
          <p>{item.label}</p>
          <p className="font-semibold">
            {getCurrencySymbol(currency)}
            {formatNumberWithCommas(item.value) ?? 0}
          </p>
        </div>
      ))}
      <Divider />
      <div className="w-full flex justify-between items-center my-4">
        <p>Total</p>
        <p className="font-semibold">
          {getCurrencySymbol(currency)}
          {formatNumberWithCommas(getTotal(calculationList)) ?? 0}
        </p>
      </div>
    </div>
  );
};

export default CalculationCard;
