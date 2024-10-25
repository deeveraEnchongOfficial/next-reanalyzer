import React from "react";
import AccordionWrapper from "@/components/accordion-wrapper";
import AccordionItemComponent from "@/components/accordion-item";
import TitleDate from "@/components/title-date";
import type {
  PropertyInfo,
  LotInfo,
  SaleHistory,
  MortgageHistory,
} from "@/lib/definition";
import { useSearchContext } from "@/context/search-context";
import { PropertyDetailsSkeleton } from "@/components/ui/skeletons";

interface PropertyDetailsTabProps {
  propertyInfo?: PropertyInfo;
  lotInfo?: LotInfo;
  saleHistory?: SaleHistory[];
  mortgageHistory?: MortgageHistory[];
  floodZoneDescription?: string;
  floodZoneType?: string;
}

type AccordionItem = {
  label: string;
  keyValue: string;
  source?: string;
};

const parkingInformation: AccordionItem[] = [
  {
    label: "Parking spaces:",
    keyValue: "parkingSpaces",
  },
  { label: "Garage type:", keyValue: "garageType" },
];

const interiorInformationLeft: AccordionItem[] = [
  {
    label: "Air conditioning:",
    keyValue: "airConditioningType",
  },
  { label: "Heating type:", keyValue: "heatingType" },
  {
    label: "Heating fuel:",
    keyValue: "heatingFuelType",
  },
  {
    label: "Plumbing fixtures:",
    keyValue: "plumbingFixturesCount",
  },
  {
    label: "Sewage usage:",
    keyValue: "utilitiesSewageUsage",
  },
  {
    label: "Water source:",
    keyValue: "utilitiesWaterSource",
  },
  { label: "Bedrooms:", keyValue: "bedrooms" },
  { label: "Bathrooms:", keyValue: "bathrooms" },
  {
    label: "Partial bathrooms:",
    keyValue: "partialBathrooms",
  },
];

const interiorInformationRight: AccordionItem[] = [
  {
    label: "Building square feet:",
    keyValue: "buildingSquareFeet",
  },
  {
    label: "Living square feet:",
    keyValue: "livingSquareFeet",
  },
  {
    label: "Interior structure:",
    keyValue: "interiorStructure",
  },
  { label: "Rooms count:", keyValue: "roomsCount", source: "propertyInfo" },
  { label: "Year built:", keyValue: "yearBuilt", source: "propertyInfo" },
  { label: "Stories:", keyValue: "stories", source: "propertyInfo" },
  {
    label: "Basement square feet:",
    keyValue: "basementSquareFeet",
  },
];

const exteriorInformationLeft: AccordionItem[] = [
  { label: "Construction:", keyValue: "construction" },
  {
    label: "Roof construction:",
    keyValue: "roofConstruction",
  },
  { label: "Roof material:", keyValue: "roofMaterial" },
  { label: "Deck area:", keyValue: "deckArea" },
  { label: "Porch area:", keyValue: "porchArea" },
  { label: "Porch type:", keyValue: "porchType" },
  { label: "Pool:", keyValue: "pool" },
  { label: "Pool area:", keyValue: "poolArea" },
];

const exteriorInformationRight: AccordionItem[] = [
  {
    label: "Lot square feet:",
    keyValue: "lotSquareFeet",
  },
  { label: "Lot acres:", keyValue: "lotAcres", source: "lotInfo" },
  { label: "Zoning:", keyValue: "zoning", source: "lotInfo" },
];

const PropertyDetailsTab: React.FC<PropertyDetailsTabProps> = ({
  propertyInfo,
  lotInfo,
  saleHistory = [],
  mortgageHistory = [],
  floodZoneDescription = "-",
  floodZoneType = "-",
}) => {
  const { isSearchLoading } = useSearchContext();

  if (isSearchLoading) {
    return <PropertyDetailsSkeleton />;
  }

  return (
    <div className="bg-white p-8 shadow-md rounded-xl mt-4">
      <TitleDate title="Property Details" />
      <DetailsAccordion
        title="Parking"
        firstList={parkingInformation}
        data={propertyInfo}
        className="rounded-t-xl"
      />

      <DetailsAccordion
        title="Interior"
        firstList={interiorInformationLeft}
        secondList={interiorInformationRight}
        data={propertyInfo}
      />
      <DetailsAccordion
        title="Exterior"
        firstList={exteriorInformationLeft}
        secondList={exteriorInformationRight}
        data={propertyInfo}
        additionalData={lotInfo}
        className="rounded-b-xl"
      />

      <HistorySection
        saleHistory={saleHistory}
        mortgageHistory={mortgageHistory}
      />
      <ClimateRisk
        floodZoneDescription={floodZoneDescription}
        floodZoneType={floodZoneType}
      />
    </div>
  );
};

export default PropertyDetailsTab;

const DetailsAccordion = ({
  data,
  firstList,
  secondList,
  title,
  additionalData = {},
  className,
}: {
  data?: { [key: string]: any };
  firstList: { label: string; keyValue: string; source?: string }[];
  secondList?: { label: string; keyValue: string; source?: string }[];
  title: string;
  additionalData?: { [key: string]: any };
  className?: string;
}) => {
  const getValue = (key: string, source?: string) => {
    if (source && additionalData[key]) {
      return additionalData[key] ?? "-";
    }
    return data?.[key] ?? "-";
  };

  return (
    <AccordionWrapper
      className={`bg-neutral-100 px-4 border-none ${className}`}
    >
      <AccordionItemComponent
        classNameTitle="py-3 font-bold"
        className="border-none"
        title={title}
      >
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {firstList && firstList?.length > 0 && (
            <ul className="list-disc px-4 text-sm space-y-2">
              {firstList.map((item) => (
                <li key={item.label}>
                  {item.label} {getValue(item.keyValue, item.source)}
                </li>
              ))}
            </ul>
          )}

          {secondList && secondList.length > 0 && (
            <ul className="list-disc px-4 text-sm space-y-2">
              {secondList.map((item) => (
                <li key={item.label}>
                  {item.label ?? "-"} {getValue(item.keyValue, item.source)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </AccordionItemComponent>
    </AccordionWrapper>
  );
};

const HistorySection = ({
  saleHistory,
  mortgageHistory,
}: {
  saleHistory: SaleHistory[];
  mortgageHistory: MortgageHistory[];
}) => (
  <div className="p-4">
    <div className="border-l-2 border-gray-300 pl-4">
      {saleHistory.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Sale History</h3>
          {saleHistory.map((sale, index) => (
            <div className="mb-4" key={index}>
              <div className="flex items-center mb-2">
                <div className="bg-blue-500 h-2 w-2 rounded-full mr-3"></div>
                <div className="text-lg font-medium">
                  {new Date(sale?.recordingDate ?? "-").toLocaleDateString()}{" "}
                  (Sold by {sale?.sellerNames ?? "-"})
                </div>
              </div>
              <div className="ml-6 text-gray-700">
                {sale?.documentType ?? "-"} - {sale?.purchaseMethod ?? "-"}
              </div>
            </div>
          ))}
        </div>
      )}
      {mortgageHistory.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Mortgage History</h3>
          {mortgageHistory.map((mortgage, index) => (
            <div className="mb-4" key={index}>
              <div className="flex items-center mb-2">
                <div className="bg-green-500 h-2 w-2 rounded-full mr-3"></div>
                <div className="text-lg font-medium">
                  {new Date(mortgage?.recordingDate)?.toLocaleDateString() ??
                    "-"}
                </div>
              </div>
              <div className="ml-6 text-gray-700">
                <p>
                  <strong>Lender:</strong> {mortgage?.lenderName ?? "-"}
                </p>
                <p>
                  <strong>Loan Type:</strong> {mortgage?.loanType ?? "-"}
                </p>
                <p>
                  <strong>Interest Rate:</strong>{" "}
                  {mortgage?.interestRate ? `${mortgage?.interestRate}%` : "-"}
                </p>
                <p>
                  <strong>Term:</strong> {mortgage?.term ?? "-"}{" "}
                  {mortgage?.termType ?? "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const ClimateRisk = ({
  floodZoneDescription,
  floodZoneType,
}: {
  floodZoneDescription: string;
  floodZoneType: string;
}) => (
  <div className="p-4 border border-gray-300 rounded-lg">
    <h2 className="text-2xl font-bold mb-4">Climate Risks</h2>
    <div className="text-gray-700">
      <p>
        <strong>Flood Zone Description:</strong> {floodZoneDescription ?? "-"}
      </p>
      <p>
        <strong>Flood Zone Type:</strong> {floodZoneType ?? "-"}
      </p>
    </div>
  </div>
);
