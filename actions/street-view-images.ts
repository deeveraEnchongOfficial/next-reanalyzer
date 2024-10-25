"use server";

import { cache } from "react";
import * as z from "zod";
import { getOrSetCache } from "@/helpers/cache";
import { CACHE_EXPIRATION, CACHE_PREFIX } from "@/helpers/constants";
import redisClient from "@/lib/redis";
import { obfuscateUrl, deobfuscateUrl } from "@/lib/utils";

const StreetViewQuerySchema = z.object({
  location: z.string().min(1, { message: "Location is required" }),
  size: z.string().default("600x300"),
  fov: z.number().min(0).max(120).default(90),
  heading: z.number().min(0).max(360).default(0),
  pitch: z.number().min(-90).max(90).default(0),
});

type StreetViewQueryInput = Partial<z.infer<typeof StreetViewQuerySchema>> & {
  location: string;
};

export const getStreetViewImage = cache(
  async (
    values: StreetViewQueryInput
  ): Promise<{ success?: string; error?: string; isLoading: boolean }> => {
    const validatedFields = StreetViewQuerySchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.errors[0].message,
        isLoading: false,
      };
    }

    const { location, size, fov, heading, pitch } = validatedFields.data;
    const cacheKey = `${CACHE_PREFIX.streetViewImage}:${location}:${size}:${fov}:${heading}:${pitch}`;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY;
    const apiUrl = "https://maps.googleapis.com/maps/api/streetview";

    if (!apiKey) {
      return { error: "Google API key is missing!", isLoading: false };
    }

    try {
      const cachedEncryptedUrl = await redisClient.get(cacheKey);
      if (cachedEncryptedUrl) {
        const originalUrl = deobfuscateUrl(cachedEncryptedUrl);
        return { success: originalUrl, isLoading: false };
      }

      const url = `${apiUrl}?location=${encodeURIComponent(
        location
      )}&size=${size}&fov=${fov}&heading=${heading}&pitch=${pitch}&key=${apiKey}`;

      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return {
          error: `Failed to fetch Street View image: ${response.status} ${errorMessage}`,
          isLoading: false,
        };
      }

      const obfuscatedUrl = obfuscateUrl(url);

      await redisClient.set(
        cacheKey,
        obfuscatedUrl,
        "EX",
        CACHE_EXPIRATION.day
      );

      return { success: url, isLoading: false };
    } catch (error) {
      return {
        error: `An error occurred: ${(error as Error).message}`,
        isLoading: false,
      };
    }
  }
);

export const getStreetViewImage2 = async (
  values: StreetViewQueryInput
): Promise<{ success?: string; error?: string }> => {
  const validatedFields = StreetViewQuerySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  const { location, size, fov, heading, pitch } = validatedFields.data;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_API_KEY;
  const apiUrl = "https://maps.googleapis.com/maps/api/streetview";

  if (!apiKey) {
    return { error: "Google API key is missing!" };
  }

  const cacheKey = `${CACHE_PREFIX.streetViewImage}:${location}:${size}:${fov}:${heading}:${pitch}`;

  try {
    const response = await getOrSetCache(
      cacheKey,
      async () => {
        try {
          const url = `${apiUrl}?location=${encodeURIComponent(
            location
          )}&size=${size}&fov=${fov}&heading=${heading}&pitch=${pitch}&key=${apiKey}`;

          const response = await fetch(url, {
            method: "GET",
          });

          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
              `Failed to fetch Street View image: ${response.status} ${errorMessage}`
            );
          }

          const imageBuffer = await response.arrayBuffer();
          const base64Image = Buffer.from(imageBuffer).toString("base64");
          const imageUrl = `data:image/jpeg;base64,${base64Image}`;

          return imageUrl;
        } catch (error) {
          throw new Error(
            `An error occurred while fetching the image: ${
              (error as Error).message
            }`
          );
        }
      },
      CACHE_EXPIRATION.day
    );

    return { success: response };
  } catch (error) {
    return { error: `An error occurred: ${(error as Error).message}` };
  }
};
