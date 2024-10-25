import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required!",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export const AutoCompleteSchema = z.object({
  search: z.string().min(1, {
    message: "Search is required",
  }),
  searchType: z.string().array().default(["C", "T"]),
});

export const PropertyDetailSchema = z.object({
  id: z.string().optional(),
  comps: z.boolean().optional(),
  exact_match: z.boolean().optional(),
  address: z.string().optional(),
  house: z.string().optional(),
  unit: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  county: z.string().optional(),
  zip: z.string().optional(),
});

const PointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

// https://developer.realestateapi.com/reference/property-parcel-api
export const PropertyParcelSchema = z.object({
  id: z.string().optional(),
  address: z.string().optional(),
  house: z.string().optional(),
  unit: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  county: z.string().optional(),
  zip: z.string().optional(),
  apn: z.string().optional(),
  fips: z.string().optional(),
  radius: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  polygon: z.array(PointSchema).optional(),
});

// https://developer.realestateapi.com/reference/property-search-api
export const PropertySearchSchema = z.object({
  count: z.boolean().optional(),
  ids: z.array(z.number()).optional(),
  ids_only: z.boolean().optional(),
  obfuscate: z.boolean().optional(),
  summary: z.boolean().optional(),
  resultIndex: z.number().optional(),
  size: z.number().optional(),
  address: z.string().optional(),
  house: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  county: z.string().optional(),
  zip: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().optional(),
  polygon: z.array(PointSchema).optional(),
  property_type: z.string().optional(),
  property_use_code: z.number().optional(),
  mls_active: z.boolean().optional(),
  mls_pending: z.boolean().optional(),
  mls_cancelled: z.boolean().optional(),
  mls_days_on_market_min: z.number().optional(),
  mls_days_on_market_max: z.number().optional(),
  mls_listing_price_min: z.number().optional(),
  mls_listing_price_max: z.number().optional(),
  mls_listing_price: z.number().optional(),
  mls_listing_price_operator: z.string().optional(),
  id: z.string().optional(),
  apn: z.string().optional(),
  stateId: z.string().optional(),
  countyId: z.string().optional(),
  neighborhood_id: z.number().optional(),
  neighborhood_name: z.string().optional(),
  searchType: z.string().optional(),
  fips: z.string().optional(),
  title: z.string().optional(),
  absentee_owner: z.boolean().optional(),
  adjustable_rate: z.boolean().optional(),
  assumable: z.boolean().optional(),
  attic: z.boolean().optional(),
  basement: z.boolean().optional(),
  breezeway: z.boolean().optional(),
  carport: z.boolean().optional(),
  cash_buyer: z.boolean().optional(),
  corporate_owned: z.boolean().optional(),
  death: z.boolean().optional(),
  deck: z.boolean().optional(),
  equity: z.boolean().optional(),
  feature_balcony: z.boolean().optional(),
  fire_sprinklers: z.boolean().optional(),
  flood_zone: z.boolean().optional(),
  foreclosure: z.boolean().optional(),
  free_clear: z.boolean().optional(),
  garage: z.boolean().optional(),
  high_equity: z.boolean().optional(),
  inherited: z.boolean().optional(),
  in_state_owner: z.boolean().optional(),
  investor_buyer: z.boolean().optional(),
  judgment: z.boolean().optional(),
  mfh_2to4: z.boolean().optional(),
  mfh_5plus: z.boolean().optional(),
  negative_equity: z.boolean().optional(),
  out_of_state_owner: z.boolean().optional(),
  patio: z.boolean().optional(),
  pool: z.boolean().optional(),
  pre_foreclosure: z.boolean().optional(),
  prior_owner_individual: z.boolean().optional(),
  private_lender: z.boolean().optional(),
  quit_claim: z.boolean().optional(),
  reo: z.boolean().optional(),
  rv_parking: z.boolean().optional(),
  tax_lien: z.boolean().optional(),
  trust_owned: z.boolean().optional(),
  vacant: z.boolean().optional(),
  census_block: z.string().optional(),
  census_block_group: z.string().optional(),
  census_tract: z.string().optional(),
  construction: z.string().optional(),
  document_type_code: z.string().optional(),
  flood_zone_type: z.string().optional(),
  loan_type_code_first: z.string().optional(),
  loan_type_code_second: z.string().optional(),
  loan_type_code_third: z.string().optional(),
  notice_type: z.string().optional(),
  parcel_account_number: z.string().optional(),
  search_range: z.string().optional(),
  sewage: z.string().optional(),
  water_source: z.string().optional(),
  estimated_equity: z.number().optional(),
  equity_operator: z.string().optional(),
  equity_percent: z.number().optional(),
  equity_percent_operator: z.string().optional(),
  last_sale_date: z.date().optional(),
  last_sale_date_operator: z.string().optional(),
  median_income: z.number().optional(),
  median_income_operator: z.string().optional(),
  years_owned: z.number().optional(),
  years_owned_operator: z.string().optional(),
  assessed_improvement_value_min: z.number().optional(),
  assessed_improvement_value_max: z.number().optional(),
  assessed_land_value_min: z.number().optional(),
  assessed_land_value_max: z.number().optional(),
  assessed_value_min: z.number().optional(),
  assessed_value_max: z.number().optional(),
  auction_date_min: z.date().optional(),
  auction_date_max: z.date().optional(),
  baths_min: z.number().optional(),
  baths_max: z.number().optional(),
  beds_min: z.number().optional(),
  beds_max: z.number().optional(),
  building_size_min: z.number().optional(),
  building_size_max: z.number().optional(),
  deck_area_min: z.number().optional(),
  deck_area_max: z.string().optional(),
  estimated_equity_min: z.number().optional(),
  estimated_equity_max: z.number().optional(),
  foreclosure_date_min: z.date().optional(),
  foreclosure_date_max: z.date().optional(),
  last_sale_date_min: z.date().optional(),
  last_sale_date_max: z.date().optional(),
  last_sale_price_min: z.number().optional(),
  last_sale_price_max: z.number().optional(),
  lot_size_min: z.number().optional(),
  lot_size_max: z.number().optional(),
  ltv_min: z.number().optional(),
  ltv_max: z.string().optional(),
  median_income_min: z.number().optional(),
  median_income_max: z.number().optional(),
  mortgage_min: z.number().optional(),
  mortgage_max: z.number().optional(),
  rooms_min: z.number().optional(),
  rooms_max: z.number().optional(),
  pool_area_min: z.number().optional(),
  pool_area_max: z.number().optional(),
  portfolio_equity_min: z.number().optional(),
  portfolio_equity_max: z.number().optional(),
  portfolio_mortgage_balance_min: z.number().optional(),
  portfolio_mortgage_balance_max: z.number().optional(),
  portfolio_purchased_last12_min: z.number().optional(),
  portfolio_purchased_last12_max: z.number().optional(),
  portfolio_purchased_last6_min: z.number().optional(),
  portfolio_purchased_last6_max: z.number().optional(),
  portfolio_value_min: z.number().optional(),
  portfolio_value_max: z.number().optional(),
  pre_foreclosure_date_min: z.date().optional(),
  pre_foreclosure_date_max: z.date().optional(),
  prior_owner_months_owned_min: z.number().optional(),
  prior_owner_months_owned_max: z.number().optional(),
  properties_owned_min: z.number().optional(),
  properties_owned_max: z.number().optional(),
  stories_min: z.number().optional(),
  stories_max: z.number().optional(),
  tax_delinquent_year_min: z.number().optional(),
  tax_delinquent_year_max: z.number().optional(),
  units_min: z.number().optional(),
  units_max: z.number().optional(),
  value_min: z.number().optional(),
  value_max: z.number().optional(),
  year_min: z.number().optional(),
  year_max: z.number().optional(),
  year_built_min: z.number().optional(),
  year_built_max: z.number().optional(),
  years_owned_min: z.number().optional(),
  years_owned_max: z.number().optional(),
  last_update_date_min: z.date().optional(),
  last_update_date_max: z.date().optional(),
});

export const UserSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  userName: z.string().min(1, {
    message: "Username is required",
  }),
  password: z.string().min(6, {
    message: "Password is required",
  }),
  newPassword: z.string().min(6, {
    message: "New password is required",
  }),
  subscriptionType: z.string().min(1, {
    message: "Subscription is required",
  }),
  discount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Discount is required" })
  ),
  monthlyTotal: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Monthly Total is required" })
  ),
  role: z.enum([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER]),
  userImage: z.string().optional(),
  isActive: z.boolean().optional(),
  aiApiInToken: z.number().optional(),
  aiApiOutToken: z.number().optional(),
  realApiCalls: z.number().optional(),
});

export const SubscriptionSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  isActive: z.boolean().optional(),
  isFree: z.boolean().optional(),
  aiTokenLimitPerDay: z.number().optional(),
  aiTokenLimitPerYear: z.number().optional(),
  aiTokenLimitPerMonth: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "AI token limit per month required" })
  ),
  realApiLimitPerDay: z.number().optional(),
  realApiLimitPerYear: z.number().optional(),
  realApiLimitPerMonth: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number()
      .min(1, { message: "Real estate API limit per month is required" })
  ),
});

export const AffiliateLinkSchema = z.object({
  normalLink: z.string().min(1, {
    message: "Normal link is required",
  }),
  affiliateLink: z.string().min(1, {
    message: "Affiliate link is required",
  }),
  isActive: z.boolean().optional(),
  type: z.string().min(1, {
    message: "Type is required",
  }),
  programLink: z.string().min(1, {
    message: "Program link is required",
  }),
  programNotes: z.string().min(1, {
    message: "Program notes is required",
  }),
});
