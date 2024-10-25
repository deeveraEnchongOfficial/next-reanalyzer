"use client";
import React, { useState, useEffect } from "react";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-notification-toast";
import { EffectiveTaxRate } from "@/types/efffective-tax-rates";
import {
  getAllEffectiveTaxRate,
} from "@/actions/admin/effective-tax-rate";

type SortKey =
  | "state"
  | "country"
  | "medianHomeValue"
  | "medianAnnualPropertyTaxPayment"
  | "averageEffectivePropertyTaxRate";
type SortOrder = "asc" | "desc";

export default function Page() {
  const [effectiveTaxRate, setEffectiveTaxRate] = useState<
    EffectiveTaxRate[]
  >([]);
  const [sortKey, setSortKey] = useState<SortKey>("state");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const { showToast } = useToast();

  const sortedEffectiveTaxRate = [...effectiveTaxRate].sort((a, b) => {
    if (sortKey in a && sortKey in b) {
      if (a[sortKey as keyof EffectiveTaxRate]! < b[sortKey as keyof EffectiveTaxRate]!) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (a[sortKey as keyof EffectiveTaxRate]! > b[sortKey as keyof EffectiveTaxRate]!) {
        return sortOrder === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const fetchEffectiveTaxRate = async () => {
    const effectiveTaxRate = await getAllEffectiveTaxRate();

    const finalEffectiveTaxRate = effectiveTaxRate.map((etr) => {
      return {
        id: etr?.id ?? ("" as string),
        state: etr?.state ?? ("" as string),
        country: etr?.country ?? ("" as string),
        medianHomeValue: etr?.medianHomeValue ?? (null as number | null),
        medianAnnualPropertyTaxPayment:
          etr?.medianAnnualPropertyTaxPayment ?? (null as number | null),
        averageEffectivePropertyTaxRate: etr?.averageEffectivePropertyTaxRate ?? (null as number | null),
        createdAt: etr?.createdAt ?? (null as Date | null),
        updatedAt: etr?.updatedAt ?? (null as Date | null),
      };
    }) as EffectiveTaxRate[];

    setEffectiveTaxRate(finalEffectiveTaxRate);
  };

  useEffect(() => {
    fetchEffectiveTaxRate();
  }, []);

  return (
    <div className="mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Effective Tax Rate</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("state")}
                  className="hover:bg-transparent"
                >
                  State
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("country")}
                  className="hover:bg-transparent"
                >
                  Country
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("medianHomeValue")}
                  className="hover:bg-transparent"
                >
                  Median Home Value
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("medianAnnualPropertyTaxPayment")}
                  className="hover:bg-transparent"
                >
                  Median Annual Property Tax Payment
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("averageEffectivePropertyTaxRate")}
                  className="hover:bg-transparent"
                >
                  Average Effective Property Tax Rate
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEffectiveTaxRate.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <span className="block text-center">No data...</span>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {sortedEffectiveTaxRate.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      {sub.state}
                    </TableCell>
                    <TableCell className="font-medium">
                      {sub.country}
                    </TableCell>
                    <TableCell className="font-medium">{sub.medianHomeValue}</TableCell>
                    <TableCell className="font-medium">
                      {sub.medianAnnualPropertyTaxPayment}
                    </TableCell>
                    <TableCell className="font-medium">
                      {sub.averageEffectivePropertyTaxRate}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
