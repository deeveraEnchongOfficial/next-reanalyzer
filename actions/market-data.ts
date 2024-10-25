"use server";

import { cache } from "react";
import * as z from "zod";
import redisClient from "@/lib/redis";
import { getData } from "@/helpers/apiHelpers";
import { getOrSetCache } from "@/helpers/cache";
import { CACHE_EXPIRATION, CACHE_PREFIX } from "@/helpers/constants";

const MarcketDataSchema = z.object({
  zipCode: z.string().min(1, "Zip code is required"),
  historyRange: z
    .number()
    .int()
    .min(1, "History range must be a positive integer"),
});

export const marketData = cache(
  async (
    values: z.infer<typeof MarcketDataSchema>
  ): Promise<{ success?: any; error?: string }> => {
    const validatedFields = MarcketDataSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: validatedFields.error.errors[0].message };
    }

    const cacheKey = `marketData:${JSON.stringify(validatedFields.data)}`;

    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Cache hit:", cacheKey);
        return { success: JSON.parse(cachedData) };
      }

      const apiKey = process.env.RENTCAST_API_KEY;
      const baseApiUrl = process.env.RENTCAST_BASE_API_URL;

      if (!apiKey || !baseApiUrl) {
        return { error: "API configuration is missing!" };
      }

      const { zipCode, historyRange } = validatedFields.data;

      const queryString = new URLSearchParams({
        zipCode,
        historyRange: historyRange.toString(),
      });

      const response = await fetch(`${baseApiUrl}/v1/markets?${queryString}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return {
          error: `Failed to fetch data: ${response.status} ${errorMessage}`,
        };
      }

      const data = await response.json();

      const lastUpdated = new Date().toISOString();
      const cachedResponse = {
        ...data,
        lastUpdated,
      };

      await redisClient.set(
        cacheKey,
        JSON.stringify(cachedResponse),
        "EX",
        86400
      );

      console.log("Cache updated:", cacheKey);

      return { success: cachedResponse };
    } catch (error) {
      return { error: `An error occurred: ${(error as Error).message}` };
    }
  }
);

export const marketData2 = async (
    values: z.infer<typeof MarcketDataSchema>
    ): Promise<{ success?: any; error?: string }> => {
    const validatedFields = MarcketDataSchema.safeParse(values);
    
    if (!validatedFields.success) {
        return { error: validatedFields.error.errors[0].message };
    }
    
    const queryParams = new URLSearchParams(validatedFields.data as any);
    const cacheKey = `${CACHE_PREFIX.marketData}:${queryParams.toString()}`;
    const apiKey = process.env.RENTCAST_API_KEY;
    const apiUrl = "https://api.rentcast.io/v1/markets";

    if (!apiKey) {
        return { error: "API key is missing!" };
    }

    try {
        const response = await getOrSetCache(
          cacheKey,
          async () => {
            try {
              const headers: Record<string, string> = {
                Accept: "application/json",
                "X-Api-Key": apiKey,
              };
    
              const response = await getData<Record<string, any>>(
                `${apiUrl}?${queryParams.toString()}`,
                "",
                {},
                headers
              );
    
              const lastUpdated = new Date().toISOString();
              const cachedResponse = {
                ...response,
                lastUpdated,
              };
    
              return cachedResponse;
            } catch (error) {
              throw new Error(`Failed to fetch data: ${(error as Error).message}`);
            }
          },
          CACHE_EXPIRATION.day
        );
    
        return { success: response };
      } catch (error) {
        return { error: `An error occurred: ${(error as Error).message}` };
      }
}
