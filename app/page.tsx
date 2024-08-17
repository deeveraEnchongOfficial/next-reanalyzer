"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/navbar";
import { autoComplete } from "@/actions/auto-complete";
import { propertySearch } from "@/actions/property-search";

export default function Home() {
  const [search, setSearch] = useState("");
  const [autoCompleteResult, setAutoCompleteResult] = useState<any[]>([]);
  const [propertySearchResult, setPropertySearchResult] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPropertyLoading, setIsPropertyLoading] = useState(false);

  useEffect(() => {
    if (search.trim()) {
      const debounceTimeout = setTimeout(() => {
        handleAutoComplete(search);
      }, 500);

      return () => clearTimeout(debounceTimeout);
    } else {
      setAutoCompleteResult([]);
    }
  }, [search]);

  const handleAutoComplete = async (search: string) => {
    setIsLoading(true);
    try {
      const result = await autoComplete({ search });

      console.log('AutoComplete',result.success.data);

      if (result.error) {
        throw new Error(result.error);
      }

      setAutoCompleteResult(result.success.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertySearch = async (selectedItem: any) => {
    const { id } = selectedItem;

    if (!id) {
      console.error("Required fields are missing.");
      return;
    }

    setIsPropertyLoading(true);
    try {
      const result = await propertySearch({id});

      console.log('PropertySearch',result.success.data);

      if (result.error) {
        throw new Error(result.error);
      }

      setPropertySearchResult(result.success.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPropertyLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSelect = (result: any) => {
    handlePropertySearch(result);
    setSearch(result.title);
    setAutoCompleteResult([]);
  };

  return (
    <div className="h-[calc(100vh-5rem)]">
      <Navbar />
      <div className="flex items-center justify-center h-full">
        <form className="flex flex-col items-center w-full">
          <div className="relative w-full px-4">
            <Input
              placeholder="Search City, Zip, Address ..."
              value={search}
              onChange={handleChange}
              className="w-full lg:w-1/2 mx-auto"
            />
            {isLoading && (
              <p className="absolute bg-white border border-gray-200 top-10 left-1/2 transform -translate-x-1/2 w-full lg:w-1/2 text-center">
                Loading...
              </p>
            )}
            {autoCompleteResult.length > 0 && (
              <div className="absolute bg-white border border-gray-200 top-10 left-1/2 transform -translate-x-1/2 w-full lg:w-1/2 z-10">
                {autoCompleteResult.map((result, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(result)}
                  >
                    <p className="font-semibold">{result.title}</p>
                    <p className="text-gray-500 text-sm">
                      {result.searchType}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {isPropertyLoading && (
              <p className="absolute bg-white border border-gray-200 top-20 left-1/2 transform -translate-x-1/2 w-full lg:w-1/2 text-center">
                Loading property details...
              </p>
            )}
            {propertySearchResult.length > 0 && (
              <div className="mt-4 w-full lg:w-1/2 mx-auto">
                <h2 className="text-lg font-semibold">Property Details</h2>
                <pre className="bg-gray-100 p-4 rounded">
                  {JSON.stringify(propertySearchResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
