import { HTTP_ERROR_STATUS_CODES } from "./constants";

export const isSuccessStatusCode = (statusCode: number) => {
  return !HTTP_ERROR_STATUS_CODES.includes(statusCode);
};

export const isErrorStatusCode = (statusCode: number) => {
  return HTTP_ERROR_STATUS_CODES.includes(statusCode);
};

export const generatePassword = (length: number = 10) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
};

export const getCacheKey = (obj: {
  [key: string]: number | string;
}): string => {
  return Object.entries(obj)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}_${value?.toString().toLowerCase() ?? ""}`)
    .join(",");
};

export const isValidJSON = (str: string) => {
  try {
    const parsed = JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const sortObjectByKeys = (obj: any): any => {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return obj; // Return the value if it's not an object
  }

  const sortedObj: { [key: string]: any } = {};
  Object.keys(obj)
    .sort()
    .forEach((key: string) => {
      sortedObj[key] = sortObjectByKeys(obj[key]); // Recursively sort nested objects
    });

  return sortedObj;
};

export const roundToDecimals = (num: number, decimals: number) =>
  Number(num.toFixed(decimals));
