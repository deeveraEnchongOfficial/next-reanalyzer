"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/navbar";
import { AutoCompleteSearch } from "@/lib/definition";
import Image from "next/image";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

// api
import { autoComplete } from "@/actions/auto-complete";
import { useSearchContext } from "@/context/search-context";
import handleApiSearchCall from "@/lib/api";
import { useRouter } from "next/navigation";

import { proFormula } from "@/lib/functions/proFormula";

interface SearchTypes {
  [key: string]: AutoCompleteSearch[];
}

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const { autoCompleteContext, setAutoCompleteContext } = useSearchContext();
  const router = useRouter();

  const handleSelectSearchTitle = (selected: AutoCompleteSearch) => {
    setSearch("");
    setAutoCompleteContext([]);
    const statePart = selected?.state || selected?.stateName;
    const cityPart = `/${selected.city?.split(" ").join("-")}`;
    router.push(`/city/${statePart}${cityPart}`);
  };

  const handleAutoComplete = (search: string) => {
    handleApiSearchCall(autoComplete, { search }, setAutoCompleteContext);
  };

  // const handlePropertySearch = (selectedItem: any) => {
  //   if (!selectedItem.id) {
  //     console.error("Required fields are missing.");
  //     return;
  //   }

  //   handleApiSearchCall(
  //     propertySearch,
  //     { id: selectedItem.id },
  //     setPropertyContext
  //   );
  // };

  // const handlePropertyDetailSearch = (selectedItem: any) => {
  //   if (!selectedItem.id) {
  //     console.error("Required fields are missing.");
  //     return;
  //   }

  //   handleApiSearchCall(
  //     propertyDetail,
  //     { id: selectedItem.id },
  //     setPropertyDetailsContext,
  //     setIsSearchLoading
  //   );
  // };

  useEffect(() => {
    if (search.trim()) {
      const debounceTimeout = setTimeout(async () => {
        handleAutoComplete(search);
      }, 500);
      return () => clearTimeout(debounceTimeout);
    }
  }, [search]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearchFocused(true);
    setSearch(e.target.value);
  };

  const searchTypeMapping: { [key: string]: string } = {
    C: "City",
    G: "Neighborhood",
    N: "County",
    P: "APN",
    // T: "State",
  };

  const filteredAutocomplete = useMemo<SearchTypes | null>(() => {
    if (autoCompleteContext.length === 0) return null;

    return autoCompleteContext.reduce((result, item) => {
      const { searchType } = item;

      const mappedSearchType = searchTypeMapping[searchType];

      if (mappedSearchType) {
        if (!result[mappedSearchType]) {
          result[mappedSearchType] = [];
        }

        result[mappedSearchType].push(item);
      }

      return result;
    }, {} as SearchTypes);
  }, [autoCompleteContext]);

  return (
    <div className="h-[calc(100vh-5rem)]">
      <Navbar />
      <div className="h-full mx-auto lg:px-0">
        <div className="w-full h-[80vh] items-center justify-center grid grid-cols-1 bg-gradient-to-b from-sky-100 via-sky-200 to-blue-300 rounded-b-[120px]">
          <div
            className="relative w-full items-center justify-center grid grid-cols-1 h-full rounded-b-[120px] shadow-md"
            style={{
              WebkitBoxShadow: "-8px 7px 3px -6px rgba(0,0,0,0.1)",
              MozBoxShadow: "-8px 7px 3px -6px rgba(0,0,0,0.1)",
              boxShadow: "-8px 7px 3px -6px rgba(0,0,0,0.1)",
            }}
          >
            <div className=" pl-0 lg:pl-[10vw] md:pr-0 flex items-center lg:items-start flex-col z-20 text-center lg:text-left ">
              <h1 className="text-[13vw] sm:text-[5rem] lg:text-[6vw] leading-[10vw] sm:leading-[3.9rem] lg:leading-[4.7vw] xl:leading-[4.8vw] font-extrabold uppercase">
                Discover <br />
                Your Ideal <br />
                <span className="relative before:content-[''] before:w-[calc(100%+2rem)] before:h-1/4 lg:before:h-2/5 before:absolute before:transform before:translate-y-[-50%] before:translate-x-[-50%] before:top-1/2 before:left-1/2 before:bg-[#80C1F0] before:-z-10">
                  Property
                </span>
              </h1>
              <p className="text-xs md:text-sm lg:text-base font-light text-center lg:text-start max-w-xl px-8 lg:px-0">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec
                odio. Quisque volutpat mattis eros. Nullam malesuada erat ut
                turpis. Suspendisse urna nibh
              </p>
              {/* search */}
              <div className="w-[calc(100%-70px)] md:w-[660px] space-y-4 z-[21] mt-4">
                <div
                  className=" p-5 rounded-lg bg-white shadow-xl "
                  style={{
                    WebkitBoxShadow: "0px 3px 3px 2px rgba(0,0,0,0.10)",
                    MozBoxShadow: "0px 3px 3px 2px rgba(0,0,0,0.10)",
                    boxShadow: "0px 3px 3px 2px rgba(0,0,0,0.10)",
                  }}
                >
                  <Label className="font-bold" htmlFor="search">
                    Search property
                  </Label>
                  <div className="relative flex justify-between w-full h-full items-center">
                    <Input
                      onFocus={() => setIsSearchFocused(!isSearchFocused)}
                      value={search}
                      onChange={handleSearch}
                      autoComplete="off"
                      id="search"
                      name="search"
                      type="search"
                      placeholder="Search Property"
                      className="bg-white w-full py-3 lg:py-3 px-4 rounded-xl rounded-r-none border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-100 z-[21]"
                    />
                    <button className="bg-[#1C8CDC] h-9 w-9 flex items-center justify-center rounded-r-xl">
                      <MagnifyingGlassIcon className="text-white h-5 w-5" />
                    </button>
                    {filteredAutocomplete && isSearchFocused && (
                      <div className="rounded-xl absolute top-11 left-0 p-2 bg-white w-full border border-gray-100 overflow-y-auto max-h-[18rem] z-[21]">
                        {Object.entries(filteredAutocomplete).map(
                          ([searchType, items]) => (
                            <div className="p-2" key={searchType}>
                              <p className="text-gray-600">{searchType}</p>
                              {items.map((item, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleSelectSearchTitle(item)}
                                  className="my-2 hover:bg-gray-100 p-2 cursor-pointer"
                                >
                                  <p className=" text-gray-800">{item.city}</p>
                                  <p className="text-xs text-gray-800">
                                    {item.title}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {isSearchFocused && (
                  <div
                    onClick={() => setIsSearchFocused(false)}
                    className="fixed inset-0 z-[20] bg-transparent"
                  ></div>
                )}
              </div>
              {isSearchFocused && (
                <div
                  onClick={() => setIsSearchFocused(false)}
                  className="fixed inset-0 z-[20] bg-transparent"
                ></div>
              )}
            </div>

            <Image
              src="/images/sample-header.png"
              className="min-w-full lg:min-w-[100%] xl:min-w-[80%] h-[60%] lg:h-[85%] object-contain object-bottom absolute bottom-0 lg:left-[calc(100%-65%)]  "
              width="0"
              height="0"
              sizes="100%"
              alt="header image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
