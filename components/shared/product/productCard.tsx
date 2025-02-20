import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IProduct } from "@/type/product";
import Link from "next/link";

import Image from "next/image";
import ProductPrice from "./productPrice";

const ProductCard = ({ product }: { product: IProduct }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${product.description}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={300}
            priority
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-sx">{product.brand}</div>
        <Link href={`/product/${product.productNumber}`}>
          <div className="flex flex-col justify-between">
            <div className="text-sm font-medium line-clamp-2 min-h-11">
              {product.name}
            </div>
            <div className="flex-between gap-4">
              <p>{product.star}Starts</p>
              {product.quantityInStock > 0 ? (
                <ProductPrice
                  className="text-red-500"
                  price={product.price}
                ></ProductPrice>
              ) : (
                <p className="text-destructive">Out Of Stock</p>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
