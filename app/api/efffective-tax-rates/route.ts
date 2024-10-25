import { db } from "@/lib/db";
import csv from "csv-parser";
import { NextResponse } from "next/server";
import { Readable } from "stream";

async function convertToNodeStream(
  webStream: ReadableStream
): Promise<Readable> {
  const reader = webStream.getReader();
  const nodeStream = new Readable({
    read() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            this.push(null);
          } else {
            this.push(Buffer.from(value));
          }
        })
        .catch((error) => {
          this.destroy(error);
        });
    },
  });

  return nodeStream;
}

async function parseCSV(file: File): Promise<
  {
    state: string;
    country: string;
    medianHomeValue: number;
    medianAnnualPropertyTaxPayment: number;
    averageEffectivePropertyTaxRate: number;
  }[]
> {
  const results: {
    state: string;
    country: string;
    medianHomeValue: number;
    medianAnnualPropertyTaxPayment: number;
    averageEffectivePropertyTaxRate: number;
  }[] = [];

  const webStream = file.stream();
  const nodeStream = await convertToNodeStream(webStream);

  return new Promise((resolve, reject) => {
    nodeStream
      .pipe(csv())
      .on(
        "data",
        (data: {
          state: string;
          country: string;
          medianHomeValue: string;
          medianAnnualPropertyTaxPayment: string;
          averageEffectivePropertyTaxRate: string;
        }) => {
          // Parse and validate numeric values from CSV
          const medianHomeValue = parseFloat(data.medianHomeValue);
          const medianAnnualPropertyTaxPayment = parseFloat(
            data.medianAnnualPropertyTaxPayment
          );
          const averageEffectivePropertyTaxRate = parseFloat(
            data.averageEffectivePropertyTaxRate
          );

          // Skip invalid rows where numbers are NaN
          if (
            !data.state ||
            !data.country ||
            isNaN(medianHomeValue) ||
            isNaN(medianAnnualPropertyTaxPayment) ||
            isNaN(averageEffectivePropertyTaxRate)
          ) {
            console.error(
              `Invalid row detected: ${JSON.stringify(data)}. Skipping...`
            );
            return; // Skip this row if validation fails
          }

          // Push valid data to the results array
          results.push({
            state: data.state,
            country: data.country,
            medianHomeValue,
            medianAnnualPropertyTaxPayment,
            averageEffectivePropertyTaxRate,
          });
        }
      )
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No CSV file provided" },
        { status: 400 }
      );
    }

    console.log("Importing effective-tax-rates from CSV file...");

    const results = await parseCSV(file);

    if (results.length === 0) {
      return NextResponse.json(
        { message: "No valid data to import from CSV" },
        { status: 400 }
      );
    }

    for (const row of results) {
      try {
        await db.effectiveTaxRate.upsert({
          where: { country: row.country },
          update: {
            medianHomeValue: row.medianHomeValue,
            medianAnnualPropertyTaxPayment: row.medianAnnualPropertyTaxPayment,
            averageEffectivePropertyTaxRate:
              row.averageEffectivePropertyTaxRate,
          },
          create: {
            state: row.state,
            country: row.country,
            medianHomeValue: row.medianHomeValue,
            medianAnnualPropertyTaxPayment: row.medianAnnualPropertyTaxPayment,
            averageEffectivePropertyTaxRate:
              row.averageEffectivePropertyTaxRate,
          },
        });
      } catch (error) {
        if ((error as Error).message.includes("Unique constraint failed")) {
          console.error(
            `Effective tax rate for ${row.state}, ${row.country} already exists.`
          );
          continue;
        } else {
          throw error;
        }
      }
    }

    return NextResponse.json(
      { message: "CSV data imported successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Failed to import effective tax rates: ${
          (error as Error).message
        }`,
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
