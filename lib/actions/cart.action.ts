"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ICartItem } from "@/type/product";
import { cookies } from "next/headers";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { covertToPlainObject, round2 } from "../utils";
import { CartItemSchema, InsertCartSchema } from "../validator";
import { revalidatePath } from "next/cache";

const calcPrice = (items: ICartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  );

  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);

  const taxPrice = round2(0.15 * itemsPrice);

  const totlaPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totlaPrice.toFixed(2),
  };
};

export const addItemToCart = async (itemData: ICartItem) => {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("No session card ID found");
    }

    const session = await auth();

    const userId = session?.user?.id ? session.user.id : undefined;

    const cart = await getMyCart();

    const item = CartItemSchema.parse({ ...itemData, quantity: 1 });

    console.log({
      sessionId: sessionCartId,
      userId: userId,
      "requested item": item,
    });

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      const newCart = InsertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({
        data: newCart as any,
      });

      revalidatePath(`/product/${product.productNumber}`);
      return {
        success: true,
        message: `${product.name} added to cart successfully`,
      };
    } else {
      const existItem = (cart.items as ICartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        if (product.quantityInStock < 1) {
          throw new Error("Not enough stock");
        }
        cart.items.find((x) => x.productId === item.productId).quantity =
          existItem.quantity + 1;
      } else {
        if (product.quantityInStock < 1) {
          throw new Error("Not enough stock");
        }

        cart.items.push(item);
      }
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items),
        },
      });

      revalidatePath(`/product/${product.productNumber}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? `updated in` : "added to"
        } cart`,
      };
    }
  } catch (error) {
    console.log({
      errors: error,
    });
    return { success: false, message: formatError(error) };
  }
};

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) {
    throw new Error("No session card ID found");
  }

  const session = await auth();
  const userId = session?.user?.id ? session.user.id : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  return covertToPlainObject({
    ...cart,
    items: cart.items as ICartItem[],
    itemPrice: cart.itemPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("No session card ID found");
    }

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    const cart = await getMyCart();

    if (!cart) throw new Error("Product not found");

    const exist = cart.items.find((x) => x.productId === productId);

    if (!exist) throw new Error("Item not found");

    if (exist.quantity === 1) {
      cart.items = cart.items.filter((x) => x.productId !== exist.productId);
    } else {
      cart.items.find((x) => x.productId === exist.productId).quantity =
        exist.quantity - 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items),
      },
    });

    revalidatePath(`/product/${product.productNumber}`);

    return {
      success: true,
      message: `${product.name} is removed from the cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
