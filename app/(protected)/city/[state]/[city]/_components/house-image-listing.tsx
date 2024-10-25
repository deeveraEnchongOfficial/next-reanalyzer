import React from "react";
import type { PropertySearch } from "@/lib/definition";

// house card
import HouseCard from "@/app/(protected)/city/[state]/[city]/_components/house-card";

interface HouseImageListingProps {
  loading: boolean;
  selectedHouse: PropertySearch | undefined;
  propertyContext: PropertySearch[];
  handleOnSelectHouse: (selected: PropertySearch | undefined) => void;
}

const HouseImageListing: React.FC<HouseImageListingProps> = ({
  loading,
  selectedHouse,
  propertyContext,
  handleOnSelectHouse,
}) => {
  return (
    <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-4 px-0">
      {loading ? (
        <>
          <HouseCard
            isLoading={loading}
            houseItem={undefined}
            variant="skeleton"
          />
          <HouseCard
            isLoading={loading}
            houseItem={undefined}
            variant="skeleton"
          />
        </>
      ) : (
        propertyContext.map((item) => (
          <HouseCard
            isLoading={loading}
            isSelected={selectedHouse && selectedHouse.id === item.id}
            handleOnSelectHouse={handleOnSelectHouse}
            variant={loading ? "skeleton" : "default"}
            key={item.id}
            houseItem={item}
          />
        ))
      )}
    </div>
  );
};

export default HouseImageListing;
