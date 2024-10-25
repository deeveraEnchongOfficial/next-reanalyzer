import Image from "next/image";
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function HorizontalSkeleton() {
  return (
    <div
      className={`${shimmer} relative bg-white shadow-lg border border-gray-50 h-[15rem] w-full flex-shrink-0 my-2 rounded-xl flex overflow-hidden animate-pulse`}
    >
      <div className="basis-2/3 flex items-center justify-center rounded-xl border-r bg-gray-200">
        <ImageSekeleton />
      </div>
      <div className="basis-full flex flex-col justify-between p-4">
        <div className="grid grid-cols-2 gap-4 text-sm w-full">
          <div className="w-full space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
          <div className="w-full space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <div className="h-6 w-6 bg-gray-300 rounded-full animate-spin"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export function Skeleton() {
  return (
    <div className="flex flex-col min-h-96 rounded-xl shadow-md border overflow-hidden">
      <div
        className={`basis-full flex items-center justify-center bg-gray-100 ${shimmer}`}
      >
        <ImageSekeleton />
      </div>

      <div className="basis-[40%] p-4">
        <div
          className={`w-24 h-6 bg-gray-200 animate-pulse mb-2 ${shimmer}`}
        ></div>

        <div className="flex gap-2 text-[.8rem]">
          <div
            className={`w-12 h-4 bg-gray-200 animate-pulse ${shimmer}`}
          ></div>
          <div
            className={`w-12 h-4 bg-gray-200 animate-pulse ${shimmer}`}
          ></div>
          <div
            className={`w-16 h-4 bg-gray-200 animate-pulse ${shimmer}`}
          ></div>
        </div>

        <div className="flex gap-2 text-[.8rem] whitespace-nowrap overflow-clip">
          <div
            className={`w-full h-4 bg-gray-200 animate-pulse mt-2 ${shimmer}`}
          ></div>
        </div>

        <div className="flex items-center text-gray-500 gap-1 mt-2">
          <div
            className={`w-full h-4 bg-gray-200 animate-pulse ${shimmer}`}
          ></div>
        </div>
      </div>
    </div>
  );
}

export function ImageSekeleton() {
  return (
    <Image
      src="/images/custom-pin.svg"
      className="h-20 w-20 filter grayscale opacity-70 animate-pulse"
      width="80"
      height="80"
      alt="logo image"
    />
  );
}

const bounce = `
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-15px);
    }
  }
`;

export function MapsAndMarketSkeleton() {
  return (
    <div className="bg-white p-8 mt-4 rounded-xl animate-pulse relative overflow-hidden">
      <style>{bounce}</style>

      {/* Title and Demographics Section */}
      <div className="h-6 w-1/3 bg-gray-300 rounded mb-4 relative overflow-hidden">
        <div className={`${shimmer}`}></div>
      </div>
      <div className="h-4 w-1/4 bg-gray-200 rounded mb-2 relative overflow-hidden">
        <div className={`${shimmer}`}></div>
      </div>

      {/* Demographics List */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-8 w-full md:w-1/3 bg-gray-200 rounded relative overflow-hidden">
          <div className={`${shimmer}`}></div>
        </div>
        <div className="h-8 w-full md:w-1/3 bg-gray-200 rounded relative overflow-hidden">
          <div className={`${shimmer}`}></div>
        </div>
        <div className="h-8 w-full md:w-1/3 bg-gray-200 rounded relative overflow-hidden">
          <div className={`${shimmer}`}></div>
        </div>
      </div>

      {/* Map Overlay Section */}
      <div className="mt-4">
        <div className="h-4 w-1/4 bg-gray-300 rounded mb-4 relative overflow-hidden">
          <div className={`${shimmer}`}></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array(4)
            .fill("")
            .map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-200 rounded-full relative overflow-hidden"
              >
                <div className={`${shimmer}`}></div>
              </div>
            ))}
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-96 bg-gray-200 rounded mt-4 relative overflow-hidden flex justify-center items-center">
          <div className={`${shimmer} absolute inset-0`}></div>

          {/* Bouncing Circles */}
          <div className="flex gap-4 z-10">
            <div className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Market Trends Section */}
      <div className="mt-4">
        <div className="h-4 w-1/4 bg-gray-300 rounded mb-4 relative overflow-hidden">
          <div className={`${shimmer}`}></div>
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-[180px] bg-gray-200 rounded-lg relative overflow-hidden">
            <div className={`${shimmer}`}></div>
          </div>
          <div className="h-10 w-[180px] bg-gray-200 rounded-lg relative overflow-hidden">
            <div className={`${shimmer}`}></div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="w-full h-64 bg-gray-200 rounded mt-4 relative overflow-hidden flex justify-center items-center">
          <div className={`${shimmer} absolute inset-0`}></div>

          {/* Bouncing Circles */}
          <div className="flex gap-2 z-10">
            <div className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row h-full bg-white p-8 rounded-xl shadow-md">
        <div className="w-full">
          {/* Top Details Skeleton */}
          <div className="flex w-full flex-col gap-2 pl-0 md:pl-4 pt-2 lg:pt-0">
            {/* Address Skeleton */}
            <div className="flex flex-col">
              <div className="flex w-full flex-col md:flex-row items-start">
                <div className="h-6 bg-gray-200 w-3/4 rounded mb-2 animate-pulse"></div>
              </div>
            </div>

            {/* Price and Property Info Skeleton */}
            <div className="flex flex-col gap-4">
              {/* Price Skeleton */}
              <div className="w-full flex gap-4">
                <div className="h-4 bg-gray-200 w-24 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 w-24 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 w-24 rounded animate-pulse"></div>
              </div>

              {/* Property Info Skeleton */}
              <div className="w-full">
                <div className="flex items-center gap-4 flex-wrap w-full">
                  {Array(4).fill("").map((_, index) => (
                    <div
                      className="flex flex-row self-start min-w-full sm:min-w-[130px] bg-gray-100 p-2 px-3 gap-4 rounded-xl"
                      key={index}
                    >
                      <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="flex flex-col">
                        <div className="h-4 bg-gray-200 w-12 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Tab Skeleton */}
      <div className="w-full">
        <div className="flex gap-4">
          {Array(4).fill("").map((_, index) => (
            <div
              key={index}
              className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Placeholder for Tab Content */}
      <div className="bg-white p-8 mt-4 rounded-xl animate-pulse relative overflow-hidden">
        <div className="overflow-auto rounded-xl border shadow-md">
          <div className="w-full h-48 bg-gray-100 relative overflow-hidden rounded-lg flex items-center justify-center">
            {/* Bouncing Circles */}
            <div className="flex gap-4 z-10">
              <div className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuyAndHoldSkeleton() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md animate-pulse">
      {/* Header Section Skeleton */}
      <div className="flex items-center justify-center mb-4">
        <div className="h-6 w-1/4 bg-gray-200 rounded relative overflow-hidden">
          <div className={`${shimmer}`}></div>
        </div>
        <div className="ml-4 h-8 w-36 bg-gray-200 rounded-full relative overflow-hidden">
          <div className={`${shimmer}`}></div>
        </div>
      </div>

      {/* ItemList Section Skeleton */}
      <div className="flex flex-col md:flex-row h-full">
        {Array(5)
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              className="w-full md:w-1/5 bg-gray-50 p-4 rounded-xl border relative overflow-hidden mb-4 md:mb-0 md:ml-4"
            >
              {/* Label Skeleton */}
              <div className="h-4 w-1/2 bg-gray-200 mb-2 rounded relative overflow-hidden">
                <div className={`${shimmer}`}></div>
              </div>

              {/* Value Skeleton */}
              <div className="h-6 w-1/3 bg-gray-200 mb-2 rounded relative overflow-hidden">
                <div className={`${shimmer}`}></div>
              </div>

              {/* Chip Skeleton */}
              <div className="h-4 w-12 bg-gray-300 rounded-full relative overflow-hidden">
                <div className={`${shimmer}`}></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export function FinancialsSkeleton() {
  return (
    <div className="bg-white mt-4 rounded-xl p-8 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-6 w-1/4 bg-gray-300 rounded mb-4 relative overflow-hidden"></div>

      {/* Cash Needed Section Skeleton */}
      <div className="h-4 w-1/4 bg-gray-200 rounded mb-2 relative overflow-hidden"></div>
      <div className="h-20 bg-gray-100 rounded-xl mb-4"></div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-4">
        {Array(4)
          .fill("")
          .map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-full"></div>
          ))}
      </div>

      {/* Table Skeleton */}
      {Array(3)
        .fill("")
        .map((_, index) => (
          <div key={index} className="mb-4">
            <div className="overflow-auto rounded-xl border shadow-md">
              <div className="w-full h-48 bg-gray-100 relative overflow-hidden rounded-lg flex items-center justify-center">
                {/* Bouncing Circles */}
                <div className="flex gap-4 z-10">
                  <div className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export function OwnerInfoSkeleton() {
  return (
    <div className="bg-white mt-4 rounded-xl p-8 animate-pulse">
      {/* Skeleton for the Title */}
      <div className="h-6 w-1/4 bg-gray-300 rounded mb-4"></div>

      {/* Skeleton for Card Content */}
      <div className="grid grid-cols-2 gap-2">
        {Array(6).fill("").map((_, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-xl border">
            <div className="h-4 w-1/2 bg-gray-200 mb-2 rounded"></div>
            <div className="h-6 w-full bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PropertyDetailsSkeleton() {
  return (
    <div className="bg-white p-8 shadow-md rounded-xl mt-4 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>

      {/* Parking Section Skeleton */}
      <div className="border border-gray-300 rounded-lg p-4 mt-4">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* Interior Section Skeleton */}
      <div className="border border-gray-300 rounded-lg p-4 mt-4">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* Exterior Section Skeleton */}
      <div className="border border-gray-300 rounded-lg p-4 mt-4">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* Sale History Section Skeleton */}
      <div className="p-4 mb-4">
        <div className="border-l-2 border-gray-300 pl-4">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          {[1, 2, 3].map((_, index) => (
            <div className="mb-4" key={index}>
              <div className="flex items-center mb-2">
                <div className="bg-gray-400 h-2 w-2 rounded-full mr-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="ml-6 h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Mortgage History Section Skeleton */}
      <div className="p-4 mb-4">
        <div className="border-l-2 border-gray-300 pl-4">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          {[1, 2, 3].map((_, index) => (
            <div className="mb-4" key={index}>
              <div className="flex items-center mb-2">
                <div className="bg-gray-400 h-2 w-2 rounded-full mr-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="ml-6 h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Climate Risks Skeleton */}
      <div className="p-4 border border-gray-300 rounded-lg mt-4">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export function SubNavSkeleton() {
  return (
    <div className="sticky top-0 bg-white mb-4">
      <nav className="container flex items-center justify-between px-4 lg:px-24 pt-4 h-[6rem]">
        <div className="flex items-center gap-4 overflow-auto h-full">
          {/* Skeleton loader for links */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 bg-gray-200 animate-pulse rounded-md"
            ></div>
          ))}
        </div>

        {/* Skeleton loader for the button */}
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md"></div>
      </nav>
    </div>
  );
}

export function HeroSectionSkeleton() {
  return (
    <div className="flex items-center h-2/3 mb-8 relative">
      {/* Bouncing Circles */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex gap-4">
          <div className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"></div>
          <div
            className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="h-6 w-6 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>

      {/* Skeleton for image */}
      <div className="h-full basis-full flex items-center justify-center rounded-xl">
        <div className="w-full h-full bg-gray-300 animate-pulse rounded-l-xl"></div>
      </div>

      {/* Skeleton for map */}
      <div className="h-full basis-3/5 rounded-r-xl">
        <div className="w-full h-full bg-gray-300 animate-pulse rounded-r-xl"></div>
      </div>
    </div>
  );
}
