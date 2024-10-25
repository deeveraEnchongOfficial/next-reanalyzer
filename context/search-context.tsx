"use client";

import { createContext, useState, ReactNode, useContext } from "react";

import type {
  AutoCompleteSearchAll,
  PropertySearch,
  PropertyDetails,
} from "@/lib/definition";
import { Property } from "@/types/property";

type SearchContextProviderProps = {
  children: ReactNode;
  autoCompleteContext: AutoCompleteSearchAll[];
  setAutoCompleteContext: React.Dispatch<
    React.SetStateAction<AutoCompleteSearchAll[]>
  >;
  propertyContext: PropertySearch[];
  setPropertyContext: React.Dispatch<React.SetStateAction<PropertySearch[]>>;
  propertyDetailsContext: PropertyDetails | null;
  setPropertyDetailsContext: React.Dispatch<
    React.SetStateAction<PropertyDetails | null>
  >;
  property: Property | null;
  setProperty: React.Dispatch<React.SetStateAction<Property | null>>;
  isSearchLoading: boolean;
  setIsSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
  hasDeepDiveData: boolean;
  setHasDeepDiveData: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SearchContext = createContext<SearchContextProviderProps>({
  children: null,
  autoCompleteContext: [],
  setAutoCompleteContext: () => {},
  propertyContext: [],
  setPropertyContext: () => {},
  propertyDetailsContext: null,
  setPropertyDetailsContext: () => {},
  property: null,
  setProperty: () => {},
  isSearchLoading: false,
  setIsSearchLoading: () => {},
  hasDeepDiveData: false,
  setHasDeepDiveData: () => {},
});

export const SearchContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [autoCompleteContext, setAutoCompleteContext] = useState<
    AutoCompleteSearchAll[]
  >([]);
  const [propertyContext, setPropertyContext] = useState<PropertySearch[]>([]);
  const [propertyDetailsContext, setPropertyDetailsContext] =
    useState<PropertyDetails | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [hasDeepDiveData, setHasDeepDiveData] = useState<boolean>(false);

  return (
    <SearchContext.Provider
      value={{
        autoCompleteContext,
        setAutoCompleteContext,
        propertyContext,
        setPropertyContext,
        propertyDetailsContext,
        setPropertyDetailsContext,
        property,
        setProperty,
        children,
        isSearchLoading,
        setIsSearchLoading,
        hasDeepDiveData,
        setHasDeepDiveData,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error(
      "useSearchContext must be used within a UserContextProvider"
    );
  }
  return context;
};
