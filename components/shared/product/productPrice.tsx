import React from "react";
import { IProductPrice } from "@/type/product";
import { cn } from "@/lib/utils";

function ProductPrice({ price, className }: IProductPrice) {
  const stringValue = price;
  const [intValue, floatValue] = stringValue.toString().split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
}

export default ProductPrice;
