-- CreateTable
CREATE TABLE "CensusEconomy" (
    "zip_code" INTEGER NOT NULL,
    "estimate_employment_status_population_16_years_and_over" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "CensusEconomy_pkey" PRIMARY KEY ("zip_code","year")
);
