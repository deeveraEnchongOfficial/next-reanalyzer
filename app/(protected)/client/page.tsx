"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons/";

// primary
import PrimaryTab from "./_components/tab/tabContents/primary/primary-tab";
import Overview from "./_components/tab/tabContents/primary/overview";
import PropertyDetailsTab from "./_components/tab/tabContents/primary/property-details-tab";
import MapAndMarket from "./_components/tab/tabContents/primary/map-and-market";
import Financials from "./_components/tab/tabContents/primary/financials";
import OwnerInfo from "./_components/tab/tabContents/primary/owner-info";

// secondary
import SecondaryTab from "./_components/tab/tabContents/secondary/secondary-tab";
import BuyAndHold from "./_components/tab/tabContents/secondary/buy-and-hold";
import FixAndFlip from "./_components/tab/tabContents/secondary/fix-and-flip";
import BRR from "./_components/tab/tabContents/secondary/brr";
import HouseHack from "./_components/tab/tabContents/secondary/house-hack";

// ai-chat
import AIConversation from "./_components/chat/ai-conversation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { PaperPlaneIcon, MinusIcon, CornersIcon } from "@radix-ui/react-icons";

import ChatWrapper from "./_components/chat/chat-wrapper";
import ChatItem from "./_components/chat/chat-item";

import { v4 as uuidv4 } from "uuid";

const primaryTabList = [
  {
    id: uuidv4(),
    label: "Overview",
    value: "overview",
    component: <Overview />,
  },
  {
    id: uuidv4(),
    label: "Property Details",
    value: "propertyDetails",
    component: <PropertyDetailsTab />,
  },
  {
    id: uuidv4(),
    label: "Map and Market",
    value: "mapAndMarket",
    component: <MapAndMarket />,
  },
  {
    id: uuidv4(),
    label: "Financials",
    value: "financials",
    component: <Financials />,
  },
  {
    id: uuidv4(),
    label: "Owner Info",
    value: "ownerInfo",
    component: <OwnerInfo />,
  },
];

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
  const [activePrimaryTab, setActivePrimaryTab] = useState(
    primaryTabList[0].label
  );
  const [activeSecondaryTab, setActiveSecondaryTab] = useState(
    secondaryTabList[0].label
  );

  const [showModalVersion, setShowModalVersion] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 1025);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="mx-4 pb-4">
      <div className="mb-4 bg-white flex lg:hidden relative items-center px-1 rounded-full shadow-sm border group focus:outline-none focus-within:ring-2 focus-within:ring-blue-500">
        <Input
          name="search"
          type="search"
          placeholder="Search Property"
          className="w-full py-[1.3rem] !shadow-none !border-none !ring-0 !focus:ring-0 !outline-none px-6 rounded-none focus:outline-none group-focus:ring-0"
        />
        <MagnifyingGlassIcon className="w-5 lg:w-6 h-5 lg:h-6 relative right-5 shrink-0" />
      </div>
      {/* end of search */}

      <div className="flex gap-4">
        {/* left */}
        <div
          className={`relative ${
            isMobile ? "basis-0" : "basis-1/4"
          }  shrink-0 self-start`}
        >
          {isMobile || showModalVersion || minimize ? (
            <AIConversation
              conversationList={conversationList}
              setMinimize={setMinimize}
              minimize={minimize}
              showModalVersion={showModalVersion}
              setShowModalVersion={setShowModalVersion}
            />
          ) : (
            <ChatWrapper
              variant="static"
              setMinimize={setMinimize}
              onHandleShowModal={setShowModalVersion}
              onShowModal={showModalVersion}
            >
              {conversationList.map((item) => (
                <ChatItem
                  key={item.id}
                  tag={item.tag}
                  message={item.message}
                  name={item.name}
                  avatarSrc={item.avatarSrc}
                />
              ))}
            </ChatWrapper>
          )}
        </div>

        {/* right */}
        <div className="w-full">
          <PrimaryTab
            tabList={primaryTabList}
            activeTab={activePrimaryTab}
            setActivePrimaryTab={setActivePrimaryTab}
          />

          <SecondaryTab
            activeTab={activeSecondaryTab}
            setActivePrimaryTab={setActiveSecondaryTab}
            tabList={secondaryTabList}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientRootPage;
