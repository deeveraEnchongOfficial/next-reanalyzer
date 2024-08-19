import React from "react";
import Image from "next/image";

export type ImageItem = {
  id: string | number;
  url: string;
  alt: string;
};

interface ImageWrapper {
  imageList: ImageItem[];
}

const ImageWrapper: React.FC<ImageWrapper> = ({ imageList }) => {
  return (
    <div className="grid gap-2 h-full w-full md:w-1/3  aspect-video">
      <Image
        src={imageList[0].url}
        alt={imageList[0].alt}
        width={300}
        height={400}
        priority
        className="rounded-lg object-cover w-full aspect-[16/10] hover:opacity-90"
      />
      <div className="grid grid-cols-3 gap-2">
        {imageList.slice(1, 4).map((item, index) =>
          index < 2 ? (
            <Image
              priority
              key={index}
              src={item.url}
              alt={item.alt}
              className="rounded-lg object-cover w-full h-full aspect-square hover:opacity-90"
              width={50}
              height={100}
            />
          ) : (
            <button
              key={index}
              className="relative rounded-lg overflow-hidden aspect-square w-full h-full"
            >
              <Image
                priority
                src={item.url}
                alt={item.alt}
                className="rounded-lg object-cover w-full h-full aspect-square"
                width={50}
                height={100}
              />
              <span className="hover:opacity-90 absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm md:text-base xl:text-lg">
                +3
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ImageWrapper;
