"use server";

import { cache } from "react";
import * as z from "zod";
import { auth } from "@/auth";
import redisClient from "@/lib/redis";
import { getCache, getOrSetCache, setCache } from "@/helpers/cache";
import { postData, getData } from "@/helpers/apiHelpers";
import { CACHE_EXPIRATION, CACHE_PREFIX } from "@/helpers/constants";
import { getCacheKey } from "@/helpers/genericHelpers";

// Define schema for validation
const RentEstimateSchema = z.object({
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  propertyType: z.string().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  squareFootage: z.number().optional(),
  maxRadius: z.number().optional(),
  daysOld: z.number().optional(),
  compCount: z.number().optional(),
});

const apiUrl = process.env.RENTCAST_API_URL;
const apiKey = process.env.RENTCAST_API_KEY;

export const rentEstimate2 = cache(
  async (
    values: z.infer<typeof RentEstimateSchema>
  ): Promise<{ success?: any; error?: string }> => {
    const validatedFields = RentEstimateSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: validatedFields.error.errors[0].message };
    }

    const queryParams = new URLSearchParams(validatedFields.data as any);
    const cacheKey = `rentEstimate:${queryParams.toString()}`;

    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Cache hit:", cacheKey);
        return { success: JSON.parse(cachedData) };
      }

      const apiKey = process.env.RENTCAST_API_KEY;
      const apiUrl = "https://api.rentcast.io/v1/avm/rent/long-term";

      if (!apiKey) {
        return { error: "API key is missing!" };
      }

      const response = await fetch(`${apiUrl}?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Api-Key": apiKey,
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

      return { success: data };
    } catch (error) {
      return { error: `An error occurred: ${(error as Error).message}` };
    }
  }
);

export const rentEstimate = async (
  values: z.infer<typeof RentEstimateSchema>
): Promise<{ success?: any; error?: string }> => {
  const validatedFields = RentEstimateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  const queryParams = new URLSearchParams(validatedFields.data as any);
  const cacheKey = getCacheKey(values);
  const apiKey = process.env.RENTCAST_API_KEY;
  const apiUrl = "https://api.rentcast.io/v1/avm/rent/long-term";

  if (!apiKey) {
    return { error: "API key is missing!" };
  }
  
  try {
    const response = await getOrSetCache(
      `${CACHE_PREFIX.rentEstimate}:${cacheKey}`,
      async () => {
        const headers: Record<string, string> = {
          Accept: "application/json",
          "X-Api-Key": apiKey,
        };

        return await getData(
          "",
          `${apiUrl}?${queryParams.toString()}`,
          "",
          headers
        );
      },
      CACHE_EXPIRATION.month
    );

    return { success: response };
  } catch (error) {
    return { error: `An error occurred: ${(error as Error).message}` };
  }
};

export const saveToRentEstimateCache = async (params: { id?: string }) => {
  if (params.id === undefined) return;

  const session = await auth();

  const key: string = `${CACHE_PREFIX.rentEstimate}:${params.id}:user:${session?.user.id}`;
  const searchedKey: string = `${CACHE_PREFIX.searchedKey}:${key}`;

  const cachedSearchKey = await getCache(searchedKey);

  if (cachedSearchKey) {
    console.log("Skipping cache update for:", key);
    return;
  }

  const headers: Record<string, string> = {
    "x-api-key": apiKey as string,
  };

  const response = await getData<{ input: any; data: any }>(
    `RentEstimate`,
    `${apiUrl}/v2`,
    JSON.stringify(params),
    headers
  );

  await setCache(key, response);
  await setCache(searchedKey, { cached: true }, CACHE_EXPIRATION.day);
};

export const saveOrUpdateToRentEstimateCacheAndDb = async (params: {
  id?: string;
}) => {
  if (params.id === undefined) return;

  const session = await auth();

  const key: string = `${CACHE_PREFIX.rentEstimate}:${params.id}:user:${session?.user.id}`;
  const searchedKey: string = `${CACHE_PREFIX.searchedKey}:${key}`;

  const cachedSearchKey = await getCache(searchedKey);

  if (cachedSearchKey) {
    console.log("Skipping cache update for:", key);
    return;
  }

  const headers: Record<string, string> = {
    "x-api-key": apiKey as string,
  };
  const response = await postData<{ input: any; data: any }>(
    `RentEstimate`,
    `${apiUrl}/v2`,
    JSON.stringify(params),
    headers
  );

  await setCache(key, response);
  await setCache(searchedKey, { cached: true }, CACHE_EXPIRATION.day);
};
