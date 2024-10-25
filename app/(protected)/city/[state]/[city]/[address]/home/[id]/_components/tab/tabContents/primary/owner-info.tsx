"use client";
import React from "react";
import { CardContent } from "@/components/ui/card";
import { useSearchContext } from "@/context/search-context";
import TitleDate from "@/components/title-date";
import { OwnerInfoSkeleton } from "@/components/ui/skeletons";

import { OwnerInfoBlur } from "@/components/ui/blurred-components";

const OwnerInfo = () => {
  const { property, isSearchLoading, hasDeepDiveData } = useSearchContext();
  if (isSearchLoading) {
    return <OwnerInfoSkeleton />;
  }

  return (
    <div className="bg-white mt-4 rounded-xl p-8">
      {/* <TitleDate title={property?.ownerInfo?.name as string} /> */}

      <TitleDate title="Owner Info" hasDeepDived={hasDeepDiveData} />
      {hasDeepDiveData ? (
        <CardContent className="p-4 grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-gray-500">Company Name</p>
            <p className="font-medium">
              {property?.ownerInfo?.companyName ?? "-"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-gray-500">Address</p>
            <p className="font-medium">{property?.ownerInfo?.address ?? "-"}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-gray-500">Owner Type</p>
            <p className="font-medium">
              {property?.ownerInfo?.ownerType ?? "-"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-gray-500">Owner Occupied</p>
            <p className="font-medium">
              {property?.ownerInfo?.ownerOccupied ?? "-"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-gray-500">Absentee Owner</p>
            <p className="font-medium">
              {property?.ownerInfo?.absenteeOwner ?? "-"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-gray-500">Ownership Length</p>
            <p className="font-medium">
              {property?.ownerInfo?.ownershipLength ?? "-"}
            </p>
          </div>
        </CardContent>
      ) : (
        <OwnerInfoBlur />
      )}
    </div>
  );
};

export default OwnerInfo;
