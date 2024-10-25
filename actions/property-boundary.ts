"use server";

import { cache } from "react";
import * as z from "zod";
import { PropertyParcelSchema } from "@/schemas";
import redisClient from "@/lib/redis";

export const propertyBoundary = cache(
  async (
    values: z.infer<typeof PropertyParcelSchema>
  ): Promise<{ success?: any; error?: string }> => {
    const validatedFields = PropertyParcelSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: validatedFields.error.errors[0].message };
    }

    const cacheKey = `propertyParcel:${JSON.stringify(validatedFields.data)}`;

    const apiKey = process.env.REAL_STATE_API_KEY;
    const apiUrl = process.env.REAL_STATE_BASE_API_URL;

    if (!apiKey || !apiUrl) {
      return { error: "API configuration is missing!" };
    }

    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Cache hit:", cacheKey);
        return { success: JSON.parse(cachedData) };
      }

      console.log("Cache miss:", cacheKey);

      const response = await fetch(`${apiUrl}/v1/PropertyParcel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(validatedFields.data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return {
          error: `Failed to fetch data: ${response.status} ${errorMessage}`,
        };
      }

      const data = await response.json();

      await redisClient.set(cacheKey, JSON.stringify(data), "EX", 2592000); // Cache expiry set to 30 days

      console.log("Cache updated:", cacheKey);

      return { success: data };
    } catch (error) {
      return { error: `An error occurred: ${(error as Error).message}` };
    }
  }
);
