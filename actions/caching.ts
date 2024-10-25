"use server";

import { auth } from "@/auth";
import { setCache } from "@/helpers/cache";
import { CACHE_EXPIRATION, CACHE_PREFIX } from "@/helpers/constants";
import { PropertyDetails, PropertySearch } from "@/lib/definition";

export const saveToPropertyDetailCache = async (
  property: PropertySearch | undefined
) => {
  if (property === undefined) return;

  const data = {
    input: {
      id: property.id,
    },
    data: {
      ...property,
    },
  };

  const key: string = `${CACHE_PREFIX.propertyDetails}:${property.id}`;
  const searchedKey: string = `${CACHE_PREFIX.searchedKey}:${key}`;

  await setCache(key, data);
  await setCache(searchedKey, { cached: true }, CACHE_EXPIRATION.month);
};

export const saveToPropertyDetailUserCache = async (
  property: PropertyDetails | undefined
) => {
  if (property === undefined) return;

  const session = await auth();

  const data = {
    input: {
      id: property.id,
    },
    data: {
      ...property,
    },
  };

  const key: string = `${CACHE_PREFIX.propertyDetails}:${property.id}:user:${session?.user.id}`;
  const searchedKey: string = `${CACHE_PREFIX.searchedKey}:${key}`;

  await setCache(key, data);
  await setCache(searchedKey, { cached: true }, CACHE_EXPIRATION.day);
};
