"use server";
import { prisma } from "@/prisma/prisma";
import { IProduct } from "@/type";
import { covertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

export async function getProducts() {
  const products = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log("");
  return covertToPlainObject(products);
}

export async function getProductByProductNumber(num: number) {
  const product = await prisma.product.findFirst({
    where: { productNumber: num || 1 },
  });
  return covertToPlainObject(product);
}

export async function updateProduct(id: number, product: IProduct) {
  const updatedProduct = await prisma.product.update({
    where: { id: "" + id },
    data: product,
  });
  return updatedProduct;
}

export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
}

export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return covertToPlainObject(data);
}
