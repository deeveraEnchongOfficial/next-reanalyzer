import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  if (!name) return "";
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("");
  return initials.toUpperCase();
}

const SHIFT = 5;

/**
 * Simple obfuscation of a URL using Caesar Cipher.
 * @param url - The URL to obfuscate.
 * @returns Obfuscated URL.
 */
export function obfuscateUrl(url: string): string {
  return url
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) + SHIFT))
    .join("");
}

/**
 * Simple deobfuscation of an obfuscated URL using Caesar Cipher.
 * @param obfuscatedUrl - The obfuscated URL.
 * @returns The original URL.
 */
export function deobfuscateUrl(obfuscatedUrl: string): string {
  return obfuscatedUrl
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) - SHIFT))
    .join("");
}

export function constructAddress(address: {
  street: string;
  city: string;
  state: string;
  zip: string;
}) {
  return `${address?.street}, ${address?.city}, ${address?.state}, ${address?.zip}`;
}

type PropertyCodeMapping = {
  [key: number]: string | undefined;
};

export const mapPropertyType = (propertyCode?: number): string | undefined => {
  const mapping: PropertyCodeMapping = {
    // Single Family
    181: "Single Family",
    380: "Single Family",
    385: "Single Family",
    363: "Single Family", // Bungalow (Residential)
    364: "Single Family", // Cluster Home
    376: "Single Family", // Patio Home
    383: "Single Family", // Rural Residence
    384: "Single Family", // Seasonal, Cabin, Vacation Residence
    390: "Single Family", // Zero Lot Line (Residential)
    447: "Single Family", // Tiny House

    // Condo
    366: "Condo",
    367: "Condo",
    379: "Condo",
    421: "Condo",
    461: "Condo",
    416: "Condo", // Landominium

    // Townhouse
    386: "Townhouse",
    382: "Townhouse",
    452: "Townhouse", // Garden Home

    // Manufactured
    371: "Manufactured",
    373: "Manufactured",

    // Multi-Family
    398: "Multi-Family",
    372: "Multi-Family",
    388: "Multi-Family", // Triplex (3 units)
    378: "Multi-Family", // Quadplex (4 units)
    369: "Multi-Family", // Duplex (2 units)
    370: "Multi-Family", // Fraternity/Sorority House
    361: "Multi-Family", // Apartment House (5+ units)
    374: "Multi-Family", // Residential Multi-Parcel
    360: "Multi-Family", // Generic Apartments
    362: "Multi-Family", // Boarding/Rooming House
    377: "Multi-Family", // Planned Unit Development (PUD)
    358: "Multi-Family", // High-Rise Apartments
    359: "Multi-Family", // Apartment House (100+ units)

    // Apartment
    357: "Apartment", // Garden/Court Apartments (5+ units)
    368: "Apartment", // Dormitory/Group Quarters
  };

  // ** if the code is not found in the mapping, return undefined it means default filter will be applied

  return propertyCode ? mapping[propertyCode] || undefined : undefined;
};


export function convertToPercentage(value: number) {
  return (value * 100).toFixed(2) + '%';
}