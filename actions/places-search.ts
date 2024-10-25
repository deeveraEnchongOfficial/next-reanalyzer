// https://maps.googleapis.com/maps/api/place/textsearch/json?query=burgers+chelsea+manhattan+new+york+city&type=restaurant&key=${YOUR-API-KEY-HERE}

"use server";

import * as z from "zod";
import { getOrSetCache } from "@/helpers/cache";
import { getData } from "@/helpers/apiHelpers";
import { CACHE_EXPIRATION, CACHE_PREFIX } from "@/helpers/constants";

const PlaceSearchSchema = z.union([
  z.object({
    latitude: z
      .number()
      .min(-90)
      .max(90, "Latitude must be between -90 and 90"),
    longitude: z
      .number()
      .min(-180)
      .max(180, "Longitude must be between -180 and 180"),
  }),
  z.object({
    address: z.string().min(1, "Address is required"),
  }),
]);

export const placeSearch = async (
  values: z.infer<typeof PlaceSearchSchema>
): Promise<{ success?: any; error?: string }> => {
  const validatedFields = PlaceSearchSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  let queryParams: URLSearchParams;

  if (
    "latitude" in validatedFields.data &&
    "longitude" in validatedFields.data
  ) {
    const { latitude, longitude } = validatedFields.data;

    queryParams = new URLSearchParams({
      location: `${latitude},${longitude}`,
      radius: "1",
    });
  } else if ("address" in validatedFields.data) {
    const { address } = validatedFields.data;

    queryParams = new URLSearchParams({
      query: address,
    });
  } else {
    return { error: "Neither latitude/longitude nor address was provided" };
  }

  const cacheKey = `${CACHE_PREFIX.placeSearch}:${queryParams.toString()}`;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return { error: "API key is missing!" };
  }

  const apiUrlNearby =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
  const apiUrlTextSearch =
    "https://maps.googleapis.com/maps/api/place/textsearch/json";

  try {
    const response = await getOrSetCache(
      cacheKey,
      async () => {
        const headers: Record<string, string> = {
          Accept: "application/json",
        };

        const apiUrlToUse =
          "latitude" in validatedFields.data ? apiUrlNearby : apiUrlTextSearch;

        return await getData(
          "",
          `${apiUrlToUse}?${queryParams.toString()}&key=${apiKey}`,
          "",
          headers
        );
      },
      CACHE_EXPIRATION.month
    );

    return { success: (response as { results: any })?.results };
  } catch (error) {
    return { error: `An error occurred: ${(error as Error).message}` };
  }
};
