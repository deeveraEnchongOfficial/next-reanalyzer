"use server";

import { CensusPopulation } from "@prisma/client";
import { findManyRecords, findUniqueRecord } from "@/helpers/dbHelpers";

export async function getCensusPopulation(where?: object) {
  const censusPopulation = await findManyRecords<CensusPopulation>({
    model: "censusPopulation",
    where: where,
  });

  return censusPopulation;
}

export async function getCensusPopulationById(censusPopulationId: string) {
  const censusPopulation = await findUniqueRecord<CensusPopulation>({
    model: "censusPopulation",
    where: { id: censusPopulationId },
  });

  return censusPopulation;
}

export async function getCensusPopulationByZipCode(zipCode: number) {
  const censusPopulation = await findManyRecords<CensusPopulation>({
    model: "censusPopulation",
    where: { zip_code: zipCode },
  });

  return censusPopulation;
}

export async function getCensusPopulationByYear(year: number) {
  const censusPopulation = await findManyRecords<CensusPopulation>({
    model: "censusPopulation",
    where: { year: year },
  });

  return censusPopulation;
}

export async function getCensusPopulationByYearAndZipCode(
  year: number,
  zipCode: number
) {
  const censusPopulation = await findManyRecords<CensusPopulation>({
    model: "censusPopulation",
    where: { year: year, zip_code: zipCode },
  });

  return censusPopulation;
}

export async function getPopulationGrowthRate(
  zipCode: number,
  year1: number,
  year2: number
) {
  const populationYear1 = await findManyRecords<CensusPopulation>({
    model: "censusPopulation",
    where: { zip_code: zipCode, year: year1 },
  });

  const populationYear2 = await findManyRecords<CensusPopulation>({
    model: "censusPopulation",
    where: { zip_code: zipCode, year: year2 },
  });

  if (populationYear1.length === 0 || populationYear2.length === 0) {
    return `Population data not available for the zip code ${zipCode} for the years ${year1} and/or ${year2}.`;
  }

  const totalPopulationYear1 =
    populationYear1[0].estimate_sex_and_age_total_population;
  const totalPopulationYear2 =
    populationYear2[0].estimate_sex_and_age_total_population;

  if (totalPopulationYear1 === 0) {
    return `Cannot calculate growth rate because the population for year ${year1} is 0.`;
  }

  const growthRate =
    ((totalPopulationYear2 - totalPopulationYear1) / totalPopulationYear1) *
    100;

  return {
    zipCode,
    year1,
    year2,
    populationYear1: totalPopulationYear1,
    populationYear2: totalPopulationYear2,
    growthRate: growthRate.toFixed(2) + "%",
  };
}

/**
 * Get the average annual growth rate over the past 5 years for a given zip code.
 * If the current year's data is unavailable, adjust the data to use the latest available years.
 * @param zipCode - The zip code to calculate the growth rate for
 * @param currentYear - The most recent year to look back from
 * @returns - The average annual growth rate or error message with the latest population number
 */
export async function getAverageAnnualGrowthRate(
  zipCode: number,
  currentYear: number
) {
  const pastYears = [
    currentYear - 4,
    currentYear - 3,
    currentYear - 2,
    currentYear - 1,
    currentYear,
  ];

  let populationData = await findManyRecords<CensusPopulation>({
    model: "censusPopulation",
    where: {
      zip_code: zipCode,
      year: { in: pastYears }, // Fetch past 5 years' data
    },
  });

  // If we have less than 5 years of data, try fetching the latest available data
  let adjusted = false;
  if (populationData.length < 5) {
    populationData = await findManyRecords<CensusPopulation>({
      model: "censusPopulation",
      where: {
        zip_code: zipCode,
      },
    });

    if (populationData.length < 5) {
      return `Insufficient population data for the zip code ${zipCode}.`;
    }

    // Sort data by year in descending order (latest first) manually
    populationData.sort((a, b) => b.year - a.year);
    // Take only the latest 5 records
    populationData = populationData.slice(0, 5);

    // Sort back into ascending order to ensure correct calculations
    populationData.sort((a, b) => a.year - b.year);
    adjusted = true;
  }

  // Calculate yearly growth rates
  let totalGrowthRate = 0;
  for (let i = 0; i < populationData.length - 1; i++) {
    const popYear1 = populationData[i].estimate_sex_and_age_total_population;
    const popYear2 =
      populationData[i + 1].estimate_sex_and_age_total_population;

    // Handle division by zero
    if (popYear1 === 0) {
      return `Cannot calculate growth rate because the population for year ${populationData[i].year} is 0.`;
    }

    const yearlyGrowthRate = ((popYear2 - popYear1) / popYear1) * 100;
    totalGrowthRate += yearlyGrowthRate;
  }

  const avgGrowthRate = totalGrowthRate / (populationData.length - 1);
  const latestPopulation =
    populationData[populationData.length - 1]
      .estimate_sex_and_age_total_population;

  const latestYear = populationData[populationData.length - 1].year;

  const result =
    avgGrowthRate >= 0
      ? `+${avgGrowthRate.toFixed(2)}% avg growth`
      : `${avgGrowthRate.toFixed(2)}% avg decline`;

  return {
    zipCode,
    pastYears: populationData.map((data) => data.year),
    latestPopulation,
    averageGrowthRate: avgGrowthRate.toFixed(2),
    result: adjusted ? `${result} (as of ${latestYear})` : result,
  };
}
