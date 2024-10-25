"use server";
import { CensusEconomy } from "@prisma/client";

import { findManyRecords } from "@/helpers/dbHelpers";
import { roundToDecimals } from "@/helpers/genericHelpers";
import { formatNumberWithCommas } from "@/lib/functions/formatNumberWithCommas";

export const getCensusEconomyAverage = async (records: CensusEconomy[]) => {
  let sum = 0;

  for (let i = 1; i < records.length; i++) {
    const currentValue =
      records[i].estimate_employment_status_population_16_years_and_over;
    const previousValue =
      records[i - 1].estimate_employment_status_population_16_years_and_over;
    const growthRate = roundToDecimals(
      ((currentValue - previousValue) / previousValue) * 100,
      2
    );
    sum += growthRate;
  }

  return roundToDecimals(sum / (records.length - 1), 2);
};

export const getCensusEconomyInformation = async (
  zipCode: number,
  pastYearsCount: number
) => {
  let records = await findManyRecords<CensusEconomy>({
    model: "censusEconomy",
    where: {
      zip_code: zipCode,
    },
    orderBy: {
      year: "desc",
    },
    take: pastYearsCount,
  });

  const sortedRecords = records.sort((a, b) => a.year - b.year);

  const latestPopulation = formatNumberWithCommas(
    sortedRecords[sortedRecords.length - 1]
      ?.estimate_employment_status_population_16_years_and_over ?? 0
  );
  const averageGrowthRate = await getCensusEconomyAverage(sortedRecords);
  const latestYear = sortedRecords[sortedRecords.length - 1]?.year ?? 0;

  return `Employed: ${latestPopulation} (${
    (averageGrowthRate > 0 ? "+" : "") + averageGrowthRate
  }% annually (as of ${latestYear}))`;
};
