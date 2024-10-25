"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useInView } from "react-intersection-observer";

import Overview from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/tab/tabContents/primary/overview";
import PropertyDetailsTab from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/tab/tabContents/primary/property-details-tab";
import MapAndMarket from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/tab/tabContents/primary/map-and-market";
import Financials from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/tab/tabContents/primary/financials";
import OwnerInfo from "@/app/(protected)/city/[state]/[city]/[address]/home/[id]/_components/tab/tabContents/primary/owner-info";
import { useSearchContext } from "./search-context";

interface SectionContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sectionRefs: SectionRef[];
}

interface Section {
  id: string;
  title: string;
  component: React.ReactNode;
}

interface SectionRef extends Section {
  ref: (node?: Element | null) => void;
  inView: boolean;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export const useSectionContext = (): SectionContextType => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error("useSectionContext must be used within a SectionProvider");
  }
  return context;
};

interface SectionProviderProps {
  children: ReactNode;
}

export const SectionProvider: React.FC<SectionProviderProps> = ({
  children,
}) => {
  const { propertyDetailsContext, property } = useSearchContext();
  const [activeSection, setActiveSection] = useState<string>("Overview");

  const sections: Section[] = [
    { id: "overview", title: "Overview", component: <Overview /> },
    {
      id: "property-details",
      title: "Property Details",
      component: (
        <PropertyDetailsTab
          propertyInfo={property?.propertyDetail?.propertyInfo ?? undefined}
          lotInfo={property?.propertyDetail?.lotInfo ?? undefined}
          floodZoneDescription={
            property?.propertyDetail?.floodZoneDescription ?? ""
          }
          floodZoneType={property?.propertyDetail?.floodZoneType ?? ""}
          mortgageHistory={property?.propertyDetail?.mortgageHistory ?? []}
          saleHistory={property?.propertyDetail?.saleHistory ?? []}
        />
      ),
    },
    { id: "map-market", title: "Map and Market", component: <MapAndMarket /> },
    { id: "financials", title: "Financials", component: <Financials /> },
    { id: "owner-info", title: "Owner Info", component: <OwnerInfo /> },
  ];

  const sectionRefs: SectionRef[] = sections.map((section) => {
    const { ref, inView } = useInView({
      threshold: 0.2,
      triggerOnce: false,
    });
    return { ...section, ref, inView };
  });

  useEffect(() => {
    const activeSectionTitle = sectionRefs.find(
      (section) => section.inView
    )?.title;
    if (activeSectionTitle) {
      setActiveSection(activeSectionTitle);
    }
  }, [sectionRefs]);

  return (
    <SectionContext.Provider
      value={{ activeSection, setActiveSection, sectionRefs }}
    >
      {children}
    </SectionContext.Provider>
  );
};
