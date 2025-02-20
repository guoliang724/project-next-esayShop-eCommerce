"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-x-4 space-y-4">
      <Image
        src={images[current]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300] object-contain object-center"
      ></Image>

      <div className="flex space-x-2">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-gray-600",
              current === index && "border-gray-500"
            )}
          >
            <Image src={image} alt="product image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductImages;
