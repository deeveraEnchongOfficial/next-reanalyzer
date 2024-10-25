"use server";
import { auth } from "@/auth";

import { Property } from "@/types/property";

import { rentEstimate } from "@/actions/rent-estimate";
import { placeSearch } from "@/actions/places-search";
import { getAverageAnnualGrowthRate } from "@/actions/census-population";
import { getCensusEconomyInformation } from "@/actions/census-economy";

import { constructAddress, mapPropertyType } from "@/lib/utils";

import { getCache, getOrSetCache, setCache } from "@/helpers/cache";
import { postData } from "@/helpers/apiHelpers";
import {
  CACHE_EXPIRATION,
  CACHE_PREFIX,
  PAST_YEARS_COUNT,
  PROPERTY_INFO_DEFAULT_VALUE,
} from "@/helpers/constants";

const apiKey = process.env.REAL_STATE_API_KEY;
const apiUrl = process.env.REAL_STATE_BASE_API_URL;

export const propertyDetail = async (params: {
  id: string;
}): Promise<{ success?: any; error?: string }> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("User session is invalid.");
    }

    const responseDetail = await getOrSetCache<{ data: any }>(
      `${CACHE_PREFIX.propertyDetails}:${params.id}`,
      async () => {
        try {
          const headers: Record<string, string> = {
            "x-api-key": apiKey as string,
          };
          const response = await postData<{ input: any; data: any }>(
            `PropertySearch`,
            `${apiUrl}/v2`,
            JSON.stringify(params),
            headers
          );
          if (!response || !response.data || response.data.length === 0) {
            throw new Error("API returned empty or invalid data.");
          }
          return { ...response, data: response.data[0] };
        } catch (error) {
          throw new Error(error?.toString());
        }
      },
      CACHE_EXPIRATION.month
    );

    const responseDetailUser = await getCache<{ data: any }>(
      `${CACHE_PREFIX.propertyDetails}:${params.id}:user:${session?.user.id}`
    );

    const finalResponse = {
      data: {
        ...responseDetail.data,
        ...responseDetailUser?.data,
      },
    };

    return { success: finalResponse };
  } catch (error) {
    console.error("Error in propertyDetail2:", error);
    return { error: error as string };
  }
};

export const fetchProperty = async (params: {
  id: string;
}): Promise<{ success?: any; error?: string }> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("User session is invalid.");
    }

    const responseDetail = await getOrSetCache<{ data: any }>(
      `${CACHE_PREFIX.propertyDetails}:${params.id}`,
      async () => {
        try {
          const headers: Record<string, string> = {
            "x-api-key": apiKey as string,
          };
          const response = await postData<{ input: any; data: any }>(
            `PropertySearch`,
            `${apiUrl}/v2`,
            JSON.stringify(params),
            headers
          );
          if (!response || !response.data || response.data.length === 0) {
            throw new Error("API returned empty or invalid data.");
          }
          return { ...response, data: response.data[0] };
        } catch (error) {
          throw new Error(error?.toString());
        }
      },
      CACHE_EXPIRATION.month
    );

    const responseDetailUser = await getCache<{ data: any }>(
      `${CACHE_PREFIX.propertyDetails}:${params.id}:user:${session?.user.id}`
    );

    const responseMap = await getCache<{ data: any }>(
      `${CACHE_PREFIX.propertyMaps}:${responseDetail?.data?.address?.zip}`
    );

    // Set initial response
    const mergedResponse = {
      ...responseDetail.data,
      ...responseDetailUser,
      ...responseMap,
    };

    if (!mergedResponse) {
      throw new Error("Merged response is invalid.");
    }

    const currentProperty = {
      id: mergedResponse.id,
      estimatedValue: mergedResponse?.estimatedValue ?? 0,
      address: {
        address: mergedResponse?.address?.address ?? "-",
        city: mergedResponse?.address?.city ?? "-",
        state: mergedResponse?.address?.state ?? "-",
        zip: mergedResponse?.address?.zip ?? "-",
        county: mergedResponse?.address?.county ?? "-",
        street: mergedResponse?.address?.street ?? "-",
      },

      latitude: mergedResponse?.propertyInfo?.latitude ?? 0,
      longitude: mergedResponse?.propertyInfo?.longitude ?? 0,
      propertyType: mergedResponse?.propertyType ?? "-",
      bedrooms: mergedResponse.propertyInfo
        ? mergedResponse.propertyInfo?.bedrooms ?? ""
        : mergedResponse.bedrooms ?? 0,
      bathrooms: mergedResponse.propertyInfo
        ? mergedResponse.propertyInfo?.bathrooms ?? ""
        : mergedResponse.bathrooms ?? 0,
      squareFeet: mergedResponse.propertyInfo
        ? mergedResponse.propertyInfo?.livingSquareFeet ??
          PROPERTY_INFO_DEFAULT_VALUE
        : mergedResponse.squareFeet ?? PROPERTY_INFO_DEFAULT_VALUE,
      lastSaleAmount:
        mergedResponse?.saleHistory?.[mergedResponse?.saleHistory?.length]
          ?.saleAmount ?? 0,
      lastSaleDate: mergedResponse?.saleHistory?.[0]?.saleDate ?? null,
      yearBuilt: mergedResponse?.propertyInfo?.yearBuilt ?? "-",
    };

    const updatedRentComparables = {
      ...mergedResponse?.rentComparables,
      comparables: [
        {
          id: mergedResponse.id,
          formattedAddress: mergedResponse?.address?.address ?? "-",
          bedrooms: mergedResponse.propertyInfo
            ? mergedResponse.propertyInfo?.bedrooms ?? ""
            : mergedResponse.bedrooms ?? 0,
          bathrooms: mergedResponse.propertyInfo
            ? mergedResponse.propertyInfo?.bathrooms ?? ""
            : mergedResponse.bathrooms ?? 0,
          squareFootage: mergedResponse.propertyInfo
            ? mergedResponse.propertyInfo?.livingSquareFeet ??
              PROPERTY_INFO_DEFAULT_VALUE
            : mergedResponse.squareFeet ?? PROPERTY_INFO_DEFAULT_VALUE,
          correlation: "",
          lotSize: "",
          yearBuilt: mergedResponse?.propertyInfo?.yearBuilt ?? "-",
          lastSeenDate: mergedResponse?.saleHistory?.[0]?.saleDate ?? null,
          latitude: mergedResponse?.propertyInfo?.latitude ?? 0,
          longitude: mergedResponse?.propertyInfo?.longitude ?? 0,
        },
        ...(mergedResponse?.rentComparables?.comparables || []),
      ],
    };

    // Response to types mapping. Main object properties are based on main sections
    const property: Property = {
      id: mergedResponse.id,
      overview: {
        address: mergedResponse.propertyInfo
          ? mergedResponse.propertyInfo?.address.label ??
            PROPERTY_INFO_DEFAULT_VALUE
          : mergedResponse.address?.address ?? PROPERTY_INFO_DEFAULT_VALUE,
        listPrice: mergedResponse?.mlsListingPrice ?? 0,
        estimatedPrice: mergedResponse?.estimatedValue ?? 0,
        estimatedRent: mergedResponse?.rentValue ?? 0,
        type: mergedResponse?.propertyType ?? PROPERTY_INFO_DEFAULT_VALUE,
        noOfBedrooms: mergedResponse.propertyInfo
          ? mergedResponse.propertyInfo?.bedrooms ?? PROPERTY_INFO_DEFAULT_VALUE
          : mergedResponse.bedrooms ?? 0, //number values should not represent string `-` should be 0
        noOfBathrooms: mergedResponse.propertyInfo
          ? mergedResponse.propertyInfo?.bathrooms ??
            PROPERTY_INFO_DEFAULT_VALUE
          : mergedResponse.bathrooms ?? PROPERTY_INFO_DEFAULT_VALUE,
        sqft: mergedResponse.propertyInfo
          ? mergedResponse.propertyInfo?.livingSquareFeet ??
            PROPERTY_INFO_DEFAULT_VALUE
          : mergedResponse.squareFeet ?? PROPERTY_INFO_DEFAULT_VALUE,
      },
      propertyDetail: {
        propertyInfo: mergedResponse.propertyInfo ?? null,
        lotInfo: mergedResponse.lotInfo ?? null,
        floodZoneDescription: mergedResponse.floodZoneDescription ?? "",
        floodZoneType: mergedResponse.floodZoneType ?? "",
        mortgageHistory: mergedResponse.mortgageHistory ?? [],
        saleHistory: mergedResponse.saleHistory ?? [],
        address: mergedResponse.address ?? null,
      },
      mapAndMarket: {
        fmrEfficiency: mergedResponse?.demographics?.fmrEfficiency ?? null,
        fmrOneBedroom: mergedResponse?.demographics?.fmrOneBedroom ?? null,
        fmrTwoBedroom: mergedResponse?.demographics?.fmrTwoBedroom ?? null,
        fmrThreeBedroom: mergedResponse?.demographics?.fmrThreeBedroom ?? null,
        fmrFourBedroom: mergedResponse?.demographics?.fmrFourBedroom ?? null,
        medianIncome: mergedResponse?.demographics?.medianIncome ?? null,
        fmrYear: mergedResponse?.demographics?.fmrYear ?? null,
        hudAreaCode: mergedResponse?.demographics?.hudAreaCode ?? null,
        hudAreaName: mergedResponse?.demographics?.hudAreaName ?? null,
        suggestedRent: mergedResponse?.demographics?.suggestedRent ?? null,
        rentComparables: updatedRentComparables ?? null,
        salesComparisons: [currentProperty, ...(mergedResponse?.comps ?? [])],
        map: {
          economy: {
            ...mergedResponse.economy,
          },
          population: {
            ...mergedResponse.population,
          },
        },
      },
      financials: {},
      ownerInfo: {
        name: mergedResponse.ownerInfo
          ? mergedResponse?.ownerInfo.owner1FullName ??
            PROPERTY_INFO_DEFAULT_VALUE
          : PROPERTY_INFO_DEFAULT_VALUE,
        companyName: mergedResponse.ownerInfo
          ? mergedResponse?.ownerInfo.companyName ?? PROPERTY_INFO_DEFAULT_VALUE
          : PROPERTY_INFO_DEFAULT_VALUE,
        address: mergedResponse.ownerInfo
          ? mergedResponse?.ownerInfo.mailAddress?.address ??
            PROPERTY_INFO_DEFAULT_VALUE
          : PROPERTY_INFO_DEFAULT_VALUE,
        ownerType: mergedResponse.ownerInfo
          ? mergedResponse?.ownerInfo.owner1Type ?? PROPERTY_INFO_DEFAULT_VALUE
          : PROPERTY_INFO_DEFAULT_VALUE,
        ownerOccupied: mergedResponse.ownerInfo
          ? mergedResponse?.ownerInfo.ownerOccupied ??
            PROPERTY_INFO_DEFAULT_VALUE
          : PROPERTY_INFO_DEFAULT_VALUE,
        absenteeOwner: mergedResponse.ownerInfo
          ? mergedResponse?.ownerInfo.absenteeOwner ??
            PROPERTY_INFO_DEFAULT_VALUE
          : PROPERTY_INFO_DEFAULT_VALUE,
        ownershipLength: mergedResponse.ownerInfo
          ? mergedResponse?.ownerInfo.ownershipLength ??
            PROPERTY_INFO_DEFAULT_VALUE
          : PROPERTY_INFO_DEFAULT_VALUE,
      },
    };

    // Set final response since data property is needed
    const finalResponse = {
      data: property,
    };

    return { success: finalResponse };
  } catch (error) {
    console.error("Error in fetchProperty:", error);
    return { error: error as string };
  }
};

export const saveOrUpdateToPropertyDetailCache = async (params: {
  id?: string;
  zip_code?: string;
  comps?: boolean;
}) => {
  console.log("params:", params);
  if (!params.id) return;

  const session = await auth();
  if (!session?.user?.id) return;

  const key = `${CACHE_PREFIX.propertyDetails}:${params.id}:user:${session.user.id}`;
  const searchedKey = `${CACHE_PREFIX.searchedKey}:${key}`;

  const cachedSearchKey = await getCache(searchedKey);
  console.log("cachedSearchKey:", cachedSearchKey);
  if (cachedSearchKey === null) {
    // Prepare headers for API call
    const headers: Record<string, string> = {
      "x-api-key": apiKey as string,
    };

    // Fetch property detail data
    const response = await postData<{ input: any; data: any }>(
      "PropertyDetail",
      `${apiUrl}/v2`,
      JSON.stringify({ id: params.id, comps: params.comps }),
      headers
    );
    console.log("response:", response);
    const address = response?.data?.propertyInfo?.address;
    if (!address) {
      console.error("Address data missing in response.");
      return;
    }

    const constructedAddress = constructAddress(address);

    // Fetch rent estimate
    const [rentCastDetails] = await Promise.all([
      rentEstimate({
        address: constructedAddress,
        compCount: 5,
        propertyType: mapPropertyType(
          response?.data?.propertyInfo?.propertyUseCode
        ),
      }),
    ]);

    const mergedResponse = {
      ...response.data,
      rentComparables: rentCastDetails?.success || null,
    };

    // Set
    await Promise.all([
      setCache(key, mergedResponse),
      setCache(searchedKey, { cached: true }, CACHE_EXPIRATION.day),
    ]);

    console.log("Data successfully cached for:", key);
  }

  //Cache economy map
  const mapKey = `${CACHE_PREFIX.propertyMaps}:${params.zip_code}`;
  const mapSearchedKey = `${CACHE_PREFIX.searchedKey}:${mapKey}`;

  const cachedMapSearchedKey = await getCache(mapSearchedKey);
  if (cachedMapSearchedKey === null) {
    const [
      placeSearchResponse,
      economyMapInfoResponse,
      censusPopulationResponse,
    ] = await Promise.all([
      placeSearch({
        address: params.zip_code ?? "",
      }),
      getCensusEconomyInformation(
        Number(params.zip_code ?? 0),
        PAST_YEARS_COUNT
      ),
      getAverageAnnualGrowthRate(
        Number(params.zip_code ?? 0),
        new Date().getFullYear()
      ),
    ]);
    const mapData = {
      economy: {
        info: economyMapInfoResponse,
        location: {
          lat: placeSearchResponse?.success?.[0]?.geometry?.location?.lat || 0,
          lng: placeSearchResponse?.success?.[0]?.geometry?.location?.lng || 0,
          place_id: placeSearchResponse?.success?.[0]?.place_id || "",
        },
      },
      population: {
        info: censusPopulationResponse,
        location: {
          lat: placeSearchResponse?.success?.[0]?.geometry?.location?.lat || 0,
          lng: placeSearchResponse?.success?.[0]?.geometry?.location?.lng || 0,
          place_id: placeSearchResponse?.success?.[0]?.place_id || "",
        },
      },
    };
    await Promise.all([
      setCache(mapKey, mapData),
      setCache(mapSearchedKey, { cached: true }, CACHE_EXPIRATION.month),
    ]);
  }
};
