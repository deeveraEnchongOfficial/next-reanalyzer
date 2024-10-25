"use server";

import { createProperty, getProperty, updateProperty } from "./property";
import { getOrSetCache } from "@/helpers/cache";
import { postData } from "@/helpers/apiHelpers";
import { CACHE_EXPIRATION, CACHE_PREFIX } from "@/helpers/constants";
import { getCacheKey, sortObjectByKeys } from "@/helpers/genericHelpers";
import { Property } from "@/types/property";

const apiKey = process.env.REAL_STATE_API_KEY;
const apiUrl = process.env.REAL_STATE_BASE_API_URL;

export const propertySearch = async (params: {
  id?: string;
  size?: number;
  city?: string;
  state?: string;
}): Promise<{ success?: any; error?: string }> => {
  try {
    const cacheKey = getCacheKey(params);
    const response = await getOrSetCache(
      `${CACHE_PREFIX.propertyList}:${cacheKey}`,
      async () => {
        try {
          const headers: Record<string, string> = {
            "x-api-key": apiKey as string,
          };
          const response = await postData(
            `PropertySearch`,
            `${apiUrl}/v2`,
            JSON.stringify(params),
            headers
          );
          return response;
        } catch (error) {
          throw new Error(error?.toString());
        }
      },
      CACHE_EXPIRATION.month
    );

    return { success: response };
  } catch (error) {
    console.log(error);
    return { error: error as string };
  }
};

export const saveOrUpdatePropertyDb = async (property?: Property | null) => {
  if (property === undefined) return;

  const propertyToSave = sortObjectByKeys({
    ...property,
  });
  const propertyInfo = await getProperty(property?.id.toString() as string);

  if (!propertyInfo) {
    await createProperty({
      propertyId: property?.id.toString() as string,
      detail: property,
    });
  } else {
    const detail = sortObjectByKeys(propertyInfo.detail as Property);

    // Only update the property if it has changed
    if (JSON.stringify(detail) !== JSON.stringify(propertyToSave)) {
      await updateProperty({
        id: propertyInfo.id,
        detail: { ...propertyToSave },
        // detail: { ...detail, ...property },
      });
    }
  }
};
