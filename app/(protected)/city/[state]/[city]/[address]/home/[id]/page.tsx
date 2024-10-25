"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "@radix-ui/react-icons/";

// secondary
import SecondaryTab from "./_components/tab/tabContents/secondary/secondary-tab";
import BuyAndHold from "./_components/tab/tabContents/secondary/buy-and-hold";
import FixAndFlip from "./_components/tab/tabContents/secondary/fix-and-flip";
import BRR from "./_components/tab/tabContents/secondary/brr";
import HouseHack from "./_components/tab/tabContents/secondary/house-hack";

// ai-chat
import AIConversation from "./_components/chat/ai-conversation";
import { HeroSectionSkeleton } from "@/components/ui/skeletons";

import { v4 as uuidv4 } from "uuid";

import { fetchProperty, propertyDetail } from "@/actions/property-detail";
import { useSearchContext } from "@/context/search-context";
import { usePathname } from "next/navigation";
import handleApiSearchCall from "@/lib/api";

import { GeoJSON } from "@/lib/functions/convertToGeoJSON";
import MapboxWrapper from "@/components/maps/providers/mapbox-wrapper";
import { propertyBoundary } from "@/actions/property-boundary";
import convertToGeoJSON from "@/lib/functions/convertToGeoJSON";
import Image from "next/image";
import { getStreetViewImage } from "@/actions/street-view-images";
import { useSectionContext } from "@/context/section-observer";
import {
  saveOrUpdatePropertyDb,
} from "@/actions/property-search";
import { PropertyDetails } from "@/lib/definition";

const secondaryTabList = [
  {
    id: uuidv4(),
    label: "Buy and Hold",
    value: "buyAndHold",
    component: <BuyAndHold />,
  },
  {
    id: uuidv4(),
    label: "Fix and Flip",
    value: "fixAndFlip",
    component: <FixAndFlip />,
    disabled: true,
  },
  {
    id: uuidv4(),
    label: "BRR",
    value: "brr",
    component: <BRR />,
    disabled: true,
  },
  {
    id: uuidv4(),
    label: "House Hack",
    value: "houseHack",
    component: <HouseHack />,
    disabled: true,
  },
];

const conversationList = [
  {
    id: uuidv4(),
    name: "AI",
    message: "Hello! How can I assist you today?",
    avatarSrc: "",
    tag: "ai",
  },
  {
    id: uuidv4(),
    name: "U",
    message: "I'd like to learn more about your product features.",
    avatarSrc: "",
    tag: "user",
  },
  {
    id: uuidv4(),
    name: "AI",
    message:
      "Certainly! Our product offers a range of features to help streamline your workflow. Some key highlights include...",
    avatarSrc: "",
    tag: "ai",
  },
  {
    id: uuidv4(),
    name: "U",
    message: "That sounds very helpful. Can you tell me more about pricing?",
    avatarSrc: "",
    tag: "user",
  },
];

const ClientRootPage = () => {
  const {
    propertyDetailsContext,
    setPropertyDetailsContext,
    property,
    setProperty,
    setIsSearchLoading,
    isSearchLoading,
  } = useSearchContext();
  const [showAiConvo, setShowAiConvo] = useState(false);
  const [image, setImage] = useState("");
  const { sectionRefs } = useSectionContext();

  const [mapCenter, setMapCenter] = useState<any>({
    longitude: 0,
    latitude: 0,
    zoom: 0,
    bearing: 0,
    padding: {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    },
    pitch: 0,
  });
  const [housePolygonData, setHousePolygonData] = useState<
    GeoJSON | undefined | null
  >(undefined);
  const pathname = usePathname();
  const propertyId = useMemo(() => {
    const id = pathname?.split("/")[pathname?.split("/").length - 1];

    return id;
  }, [pathname]);

  const handlePropertyDetailsSearch = useCallback(async () => {
    if (!propertyId) return;

    await handleApiSearchCall(
      propertyDetail,
      { id: propertyId },
      setPropertyDetailsContext
    );
  }, [propertyId, setPropertyDetailsContext]);

  const loadProperty = useCallback(async () => {
    if (!propertyId) return;

    await handleApiSearchCall(
      fetchProperty,
      { id: propertyId },
      setProperty,
      setIsSearchLoading
    );
  }, [propertyId, setProperty]);

  const fetchPropertyBoundary = async () => {
    const res = await propertyBoundary({
      id:
        (propertyDetailsContext && propertyDetailsContext?.id?.toString()) ||
        undefined,
    });
    if (res?.success)
      setHousePolygonData(
        convertToGeoJSON(
          res.success?.data?.geometry,
          String(propertyDetailsContext?.id),
          propertyDetailsContext?.propertyInfo?.address?.address ?? ""
        )
      );
  };

  const handleFetchImage = async () => {
    if (
      !propertyDetailsContext?.longitude ||
      !propertyDetailsContext?.latitude
    ) {
      return;
    }
    const location = `${propertyDetailsContext?.latitude}, ${propertyDetailsContext?.longitude}`;

    const { success, error } = await getStreetViewImage({
      location,
      size: "600x600",
    });

    if (success) {
      setImage(success);
    } else {
      console.error("Error fetching street view image:", error);
    }
  };

  useEffect(() => {
    // api call
    if (propertyDetailsContext) return;
    handlePropertyDetailsSearch();
  }, [handlePropertyDetailsSearch]);

  useEffect(() => {
    // api call
    fetchPropertyBoundary();

    handleFetchImage();

    setMapCenter({
      longitude: propertyDetailsContext?.longitude || 0,
      latitude: propertyDetailsContext?.latitude || 0,
      zoom: 17,
      bearing: 0,
      padding: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      },
      pitch: 0,
    });
  }, [propertyDetailsContext]);

  useEffect(() => {
    const onPropertyLoad = async () => {
      console.log(property);
      if (!property) return;

      await saveOrUpdatePropertyDb(property);
    };

    onPropertyLoad();
  }, [property]);

  useEffect(() => {
    loadProperty();
  }, []);

  return (
    // <CustomSkeleton />
    <div className="pb-4 h-full flex flex-col overflow-hidden relative">
      <AIConversation
        onShowModal={setShowAiConvo}
        showModal={showAiConvo}
        conversationList={conversationList}
      />

      {/* right */}
      <div className="overflow-y-scroll overflow-x-hidden flex flex-col h-full basis-full rounded-t-xl">
        <div className="lg:px-[15vw] h-full">
          {/* hero */}
          {isSearchLoading ? (
            <HeroSectionSkeleton />
          ) : (
            <div className="flex items-center h-2/3 mb-8">
              <div className="h-full basis-full flex items-center justify-center rounded-xl">
                {image ? (
                  <Image
                    src={image}
                    alt="property image"
                    width="0"
                    height="0"
                    sizes="100%"
                    priority
                    className="w-full h-full aspect-video object-cover rounded-l-xl"
                  />
                ) : (
                  <ImageIcon className="w-7 h-7" />
                )}
              </div>
              <div className="h-full basis-3/5 rounded-r-xl">
                <MapboxWrapper
                  style={{
                    borderTopRightRadius: ".75rem",
                    borderBottomRightRadius: ".75rem",
                    height: "100%",
                  }}
                  {...mapCenter}
                  onMove={(evt) => setMapCenter(evt.viewState)}
                  scrollZoom={false}
                  geoJsonData={housePolygonData || null}
                />
              </div>
              {/* sections */}
            </div>
          )}
          {sectionRefs.map(({ id, component, ref }) => (
            <section id={id} key={id} ref={ref} className="mb-8">
              {component}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientRootPage;
