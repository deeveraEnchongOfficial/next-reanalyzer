import redisClient from "@/lib/redisClient";
import { CACHE_PREFIX } from "./constants";
import { isValidJSON } from "./genericHelpers";

type CacheCallback<T> = () => Promise<T>;

// Create or update cache
export const setCache = async <T>(
  key: string,
  data: T,
  ttl?: number
): Promise<void> => {
  const serializedData = JSON.stringify(data);
  if (ttl) {
    await redisClient.setEx(key, ttl, serializedData); // Set with expiration
  } else {
    await redisClient.set(key, serializedData); // No expiration
  }
};

// Read cache
export const getCache = async <T>(key: string): Promise<T | null> => {
  const cachedData = await redisClient.get(key);
  if (!cachedData || isValidJSON(cachedData) === false) {
    return null; // Key does not exist
  }
  return JSON.parse(cachedData);
};

// Delete cache
export const deleteCache = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

// Update cache (similar to set but could include business logic)
export const updateCache = async <T>(
  key: string,
  data: T,
  ttl?: number
): Promise<void> => {
  await setCache(key, data, ttl); // Reuse setCache to handle update
};

// Get Cached or Fresh data
export const getOrSetCache = async <T>(
  key: string,
  callback: CacheCallback<T>,
  ttl?: number
): Promise<T> => {
  const cachedKey = await getCache(`${CACHE_PREFIX.searchedKey}:${key}`);
  if (cachedKey !== null) {
    console.log(`${CACHE_PREFIX.searchedKey}:${key}` + " hit!");
    const cachedData = await getCache(key);
    if (cachedData) {
      console.log(key + " hit!");
      return cachedData as T;
    }
  }

  const freshData = await callback();

  await setCache(key, freshData);
  await setCache(
    `${CACHE_PREFIX.searchedKey}:${key}`,
    { cached: true },
    ttl as number
  );

  return freshData;
};
