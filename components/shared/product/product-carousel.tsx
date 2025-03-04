"use client";

import React from "react";
import { IProduct } from "@/type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { banners } from "@/assets/imgs/banners";

function ProductCarousel({ data }: { data: IProduct[] }) {
  return (
    <Carousel
      className="w-full mb-12 flex justify-center"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent className="mx-auto">
        {data.map((product: IProduct, index) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.productNumber}`}>
              <div className="relative mx-auto flex justify-center">
                <Image
                  src={banners[index]}
                  alt={product.name}
                  width={0}
                  height={0}
                  className="h-60 object-cover"
                />
                {/* <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                    {product.name}
                  </h2>
                </div> */}
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious></CarouselPrevious>
      <CarouselNext></CarouselNext>
    </Carousel>
  );
}

export default ProductCarousel;
