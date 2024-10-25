"use client";
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { BiSolidKey, BiLoaderAlt, BiRevision } from "react-icons/bi";

import { Button } from "@/components/ui/button";
// import { SubNavSkeleton } from "@/components/ui/skeletons";

import { useToast } from "@/hooks/use-notification-toast";
import { usePropertyDetail } from "@/hooks/use-property-detail";

import { useSectionContext } from "@/context/section-observer";
import { useSearchContext } from "@/context/search-context";

import { createEventLog } from "@/actions/event-log";
import {
  fetchProperty,
  saveOrUpdateToPropertyDetailCache,
} from "@/actions/property-detail";

import handleApiSearchCall from "@/lib/api";
import { saveOrUpdatePropertyDb } from "@/actions/property-search";

const SubNav = () => {
  const pathname = usePathname();
  const propertyId = pathname?.split("/")[pathname?.split("/").length - 1];
  const { activeSection, setActiveSection, sectionRefs } = useSectionContext();
  const {
    propertyDetailsContext,
    property,
    setProperty,
    isSearchLoading,
    hasDeepDiveData,
    setHasDeepDiveData,
    setIsSearchLoading,
  } = useSearchContext();

  const { isRefreshAllowed, hasDeepDived } = usePropertyDetail();
  const { showToast } = useToast();

  const [isRefreshingProperty, setIsRefreshingProperty] = useState(false);

  const loadProperty = useCallback(async () => {
    if (!propertyDetailsContext?.id) return;

    await handleApiSearchCall(
      fetchProperty,
      { id: propertyDetailsContext?.id?.toString() },
      setProperty
    );
  }, [propertyDetailsContext?.id, setProperty]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: { title: string; id: string }
  ) => {
    e.preventDefault();
    const target = document.querySelector(`#${link.id}`);

    if (target) {
      setActiveSection(link.title);

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleDeepDiveButtonClick = async () => {
    const isAllowed = await isRefreshAllowed();
    if (!isAllowed) {
      showToast("All Deep Dive credits used", "error");
      return;
    }

    setIsRefreshingProperty(true);
    setIsSearchLoading(true);

    await createEventLog({
      event: "ButtonClicked",
      app: {
        source: "deep_dive",
        page: pathname || "",
      },
    });

    await saveOrUpdateToPropertyDetailCache({
      id: propertyDetailsContext?.id?.toString(),
      zip_code: propertyDetailsContext?.address?.zip ?? "",
      comps: true,
    });
    
    await loadProperty();

    const hasDived = await hasDeepDived(propertyId);
    setHasDeepDiveData(hasDived);

    setIsRefreshingProperty(false);
    setIsSearchLoading(false);
  };

  useEffect(() => {
    const finalizeHasDeepDived = async () => {
      setIsSearchLoading(true);
      if (
        isRefreshingProperty === true ||
        property === null ||
        property?.id === null
      ) {
        setIsSearchLoading(false);
        return;
      }

      const hasDived = await hasDeepDived(property?.id);
      setHasDeepDiveData(hasDived);
      console.log(property);
      await saveOrUpdatePropertyDb(property);
      setIsSearchLoading(false);
    };

    finalizeHasDeepDived();
  }, [property]);

  const deepdiveSaveButton = (
    <>
      <div className="flex items-center gap-4 basis-1/12 shrink-0">
      <Button
            className="w-full bg-gradient-to-l from-primary to-primary/50 transition-opacity duration-500 px-3 py-5 rounded-xl text-white hover:text-white flex items-center gap-2 opacity-100 hover:opacity-90"
            variant="ghost"
            size="icon"
            disabled={isRefreshingProperty}
            onClick={handleDeepDiveButtonClick}
          >
            {hasDeepDiveData ? (
              <>
                {isRefreshingProperty ? (
                  <>
                    <BiLoaderAlt className="w-5 h-5 text-white animate-spin" />
                    <span>Refreshing Data...</span>
                  </>
                ) : (
                  <>
                    <BiRevision className="w-5 h-5 text-white" />
                    <span>Refresh Data</span>
                  </>
                )}
              </>
            ) : (
              <>
                {isRefreshingProperty ? (
                  <>
                    <BiLoaderAlt className="w-5 h-5 text-white animate-spin" />
                    <span>Deep Diving...</span>
                  </>
                ) : (
                  <>
                    <BiSolidKey className="w-5 h-5 text-white" />
                    <span>Deep Dive</span>
                  </>
                )}
              </>
            )}
          </Button>

        <Button
          className="w-full px-4 rounded-xl py-5"
          variant="ghost"
          size="icon"
        >
          <BookmarkFilledIcon className="w-7 h-7 text-yellow-400" />
          <span>Save</span>
        </Button>
      </div>
    </>
  );

  // if (isSearchLoading) {
  //   return <SubNavSkeleton />;
  // }

  return (
    <div className="sticky top-0 bg-white mb-4">
      <motion.nav
        className="container flex items-center justify-between px-4 lg:px-24 pt-4 h-[6rem]"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-4 overflow-auto h-full">
          {sectionRefs.map((link) => (
            <Link
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link)}
              className={`relative inline-flex h-full items-center justify-center px-4 text-sm font-medium transition-colors ${
                activeSection === link.title ? "" : "text-muted-foreground"
              }`}
            >
              {link.title}
              {activeSection === link.title && (
                <span className="absolute bottom-0 left-0 h-[4px] w-full bg-primary transform scale-x-100 transition-transform duration-300"></span>
              )}
            </Link>
          ))}
        </div>

        {deepdiveSaveButton}
      </motion.nav>
    </div>
  );
};

export default SubNav;