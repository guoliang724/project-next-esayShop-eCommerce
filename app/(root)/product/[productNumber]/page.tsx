import { getProductByProductNumber } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/product/productPrice";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.action";

/* eslint-disable @typescript-eslint/no-explicit-any */

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ productNumber: string }>;
}) => {
  const { productNumber } = await params;

  const transferToNumber = parseInt(productNumber);

  const product = await getProductByProductNumber(transferToNumber);

  if (!product) {
    return notFound();
  }

  const cart = await getMyCart();

  return (
    <div>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {product.rating as any} of {product.numReviews} Reviews
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProductPrice
                  price={product.price}
                  className="w-24 rounded-full bg-green-700 px-5 py-2"
                />
                <Badge color="green">In Stock</Badge>
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: product.details }}
              ></p>
              {/* <p>{product.description}</p> */}
            </div>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>price</div>
                  <div>
                    <ProductPrice price={product.price}></ProductPrice>
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.quantityInStock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                {product.quantityInStock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        productNumber: product.productNumber,
                        image: product.images[0],
                        quantity: product.quantityInStock,
                        price: product.price,
                      }}
                    ></AddToCart>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
