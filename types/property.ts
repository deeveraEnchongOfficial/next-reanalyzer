import type {
  PropertyInfo as PropertyInfoType,
  LotInfo,
  MortgageHistory,
  SaleHistory,
  PropertyAddress,
  RentComparables,
  SalesComparison,
  LongLat,
} from "@/lib/definition";

type PropertyMap = {
  economy?: {
    info?: string;
    location?: {
      lat: number;
      lng: number;
      place_id: string;
    };
  };
  population?: {
    info?: CensusPopulation;
    location?: {
      lat: number;
      lng: number;
      place_id: string;
    };
  };
};

type Overview = {
  address?: string | null;
  listPrice?: number | null;
  estimatedPrice?: number | null;
  estimatedRent?: number | null;
  type?: string | null;
  noOfBedrooms?: number | null;
  noOfBathrooms?: number | null;
  sqft?: number | null;
};

type PropertyDetail = {
  propertyInfo?: PropertyInfoType | null;
  lotInfo?: LotInfo | null;
  floodZoneDescription?: string | null;
  floodZoneType?: string | null;
  mortgageHistory?: MortgageHistory[] | null;
  saleHistory?: SaleHistory[] | null;
  address?: PropertyAddress | null;
  longitude?: number;
  latitude?: number;
};

type MapAndMarket = {
  fmrOneBedroom?: string | null;
  fmrTwoBedroom?: string | null;
  fmrThreeBedroom?: string | null;
  fmrFourBedroom?: string | null;
  medianIncome?: string | null;
  fmrEfficiency?: string | null;
  fmrYear?: string | null;
  hudAreaCode?: string | null;
  hudAreaName?: string | null;
  suggestedRent?: string | null;
  map?: PropertyMap;
  rentComparables?: RentComparables | null;
  salesComparisons?: SalesComparison[] | null;
};

type Financials = {};

type OwnerInfo = {
  name?: string | null;
  companyName?: string | null;
  address?: string | null;
  ownerType?: string | null;
  ownerOccupied?: string | null;
  absenteeOwner?: boolean | null;
  ownershipLength?: number | null;
};

export type CensusPopulation = {
  zipCode?: string | number | null;
  pastYears?: string[];
  averageGrowthRate?: string | null;
  result?: string | null;
  latestPopulation: string | number | null;
};

export type Geometry = {
  location?: LongLat | null;
  viewport?: {
    northeast: LongLat;
    southwest: LongLat;
  };
};

export type PopulationBoundary = {
  formatted_address?: string | null;
  geometry?: Geometry | null;
  place_id?: string | null;
  censusPopulation?: CensusPopulation | null;
};

export type Property = {
  id: string;
  overview?: Overview;
  propertyDetail?: PropertyDetail;
  mapAndMarket?: MapAndMarket;
  financials?: Financials;
  ownerInfo?: OwnerInfo;
};

export type PropertyInfo = {
  id?: string;
  propertyId?: string;
  detail?: any;
};

export type PropertyInfoRequest = PropertyInfo & {};

export type PropertyInfoResponse = PropertyInfo & {};
