/** @format */

"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { FaUser } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExitIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { LogoutButton } from "@/components/auth/logout-button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons/";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import NavItem from "./nav-item";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSearchContext } from "@/context/search-context";
import { AutoCompleteSearch } from "@/lib/definition";
import Image from "next/image";

// api
import { autoComplete } from "@/actions/auto-complete";
import { useRouter } from "next/navigation";

export default function Component() {
  const user = useCurrentUser();
  const [search, setSearch] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const { autoCompleteContext, setAutoCompleteContext } = useSearchContext();
  const router = useRouter();

  const navbarItems = [
    { id: 1, to: "#", label: "Saved", prefetch: false },
    { id: 2, to: "#", label: "Feedback", prefetch: false },
    { id: 3, to: "#", label: "About", prefetch: false },
  ];

  const handleAutoComplete = async (search: string) => {
    try {
      const result = await autoComplete({ search });

      if (result.error) {
        throw new Error(result.error);
      }

      setAutoCompleteContext(result.success.data ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectSearchTitle = (selected: AutoCompleteSearch) => {
    setAutoCompleteContext([]);
    setSearch("");
    router.push(`/city/${selected.state}/${selected.city}`);
  };

  useEffect(() => {
    if (search.trim()) {
      const debounceTimeout = setTimeout(async () => {
        await handleAutoComplete(search);
      }, 500);
      return () => clearTimeout(debounceTimeout);
    }
  }, [search]);

  interface SearchTypes {
    [key: string]: AutoCompleteSearch[];
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const searchTypeMapping: { [key: string]: string } = {
    C: "City",
    G: "Neighborhood",
    N: "County",
    P: "APN",
    T: "State",
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
    <div className="flex h-12 lg:h-16 items-center px-2 lg:px-24 shadow-sm border">
      <Sheet>
        {/* mobile */}
        <div className="flex items-center gap-4 w-full lg:w-0 px-2 lg:px-0">
          <SheetTrigger className="order-2 lg:order-1" asChild>
            <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
              <HamburgerMenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <Link
            href="/"
            className="w-full block lg:hidden order-1 lg:order-2"
            prefetch={false}
          >
            ReanalyzeAI
          </Link>
        </div>

        <SheetContent className="px-6" side="left">
          <VisuallyHidden>
            <SheetDescription />
            <SheetTitle />
          </VisuallyHidden>
          <SheetTitle>
            <Link
              href="/"
              className="w-full block lg:hidden order-1 lg:order-2"
              prefetch={false}
            >
              <h1 className="text-lg font-light lg:font-semibold">
                ReanalyzeAI
              </h1>
            </Link>
          </SheetTitle>

          {/* mobile */}
          <nav className="flex flex-col h-full pb-4 pt-4">
            <div className="grid gap-2 py-4">
              {navbarItems.map((item) => (
                <NavItem navItem={item} key={item.id}>
                  {item.label}
                </NavItem>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* logo */}
      <div className="flex-1 flex items-center gap-2 h-full">
        <NavItem
          navItem={{ to: "/", label: "", prefetch: false }}
          className="font-semibold text-xl hidden lg:block"
        >
          <Image
            src="/images/logo.svg"
            className="w-9 h-9 object-contain object-bottom "
            width="0"
            height="0"
            sizes="100%"
            alt="logo image"
          />
        </NavItem>
        <div className="items-center relative w-full z-[11] max-w-lg group focus-within:max-w-[60rem] transition-all duration-300 lg:flex hidden">
          <Input
            onFocus={() => setIsSearchFocused(!isSearchFocused)}
            value={search}
            onChange={handleSearch}
            autoComplete="off"
            name="search"
            type="search"
            placeholder="Search Property"
            className="bg-white block w-full py-3 lg:py-3 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-100 z-[21]"
          />
          {isSearchFocused ? (
            <MagnifyingGlassIcon className="text-gray-400 h-5 w-5 absolute right-4 z-[21]" />
          ) : (
            <></>
          )}

          {/* result */}
          {filteredAutocomplete && isSearchFocused && (
            <div className=" rounded-xl absolute top-12 left-0 z-10 p-2 bg-white w-full border border-gray-100 overflow-y-auto max-h-[18rem]">
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
                        <p className="text-xs text-gray-800">{item.title}</p>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
          {isSearchFocused && (
            <div
              onClick={() => setIsSearchFocused(false)}
              className="fixed inset-0 -z-10 bg-transparent"
            ></div>
          )}
        </div>
      </div>

      {/* desktop */}
      <nav className="ml-auto hidden lg:flex gap-4">
        {navbarItems.map((item, index) => (
          <NavItem navItem={item} key={item.id + index}>
            {item.label}
          </NavItem>
        ))}
      </nav>
      <div className="hidden lg:flex gap-6 ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className="bg-neutral-700 text-white">
                <FaUser />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[48]" align="end">
            <LogoutButton>
              <DropdownMenuItem>
                <ExitIcon className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
