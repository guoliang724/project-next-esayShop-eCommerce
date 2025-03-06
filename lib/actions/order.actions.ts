/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { covertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validator";
import { prisma } from "@/prisma/prisma";
import { ICartItem, IPaymentResult } from "@/type";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
export async function createOrder() {
  try {
    const session = await auth();

    if (!session) throw new Error("Unthenticated");

    const cart = await getMyCart();

    const userId = session?.user?.id ? session.user.id : undefined;

    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return { success: false, message: "Cart is empty", redirectTo: "/cart" };
    }

    if (!user.address) {
      return {
        success: false,
        message: "Please add shipping address",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "Please select payment method",
        redirectTo: "/payment-method",
      };
    }

    const order = insertOrderSchema.parse({
      userId: session?.user?.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemPrice,
      taxPrice: cart.taxPrice,
      shippingPrice: cart.shippingPrice,
      totalPrice: cart.totalPrice,
    });

    const insetedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order as any });

      for (const item of cart.items as ICartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
            slug: item.productNumber + "",
            productNumber: undefined,
          } as any,
        });
      }

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insetedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order Created",
      redirectTo: `/order/${insetedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

export const getOrderById = async (orderId: string) => {
  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItem: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return covertToPlainObject(data);
};

export const createPayPalOrder = async (orderId: string) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      const payPalOrder = await paypal.createOrder(Number(order.totalPrice));

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentResult: {
            id: payPalOrder.id,
            status: "",
            email_address: "",
            pricePaid: 0,
          },
        },
      });

      return {
        success: true,
        message: "Item order created successfully",
        data: payPalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const approvePayPalorder = async (
  orderId: string,
  data: { orderID: string }
) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as IPaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Payment failed");
    }

    await updateOrderToPaid(orderId, {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
      pricePaid:
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: `Your order has been paid successfully`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const updateOrderToPaid = async (
  orderId: string,
  paymentResut?: IPaymentResult
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItem: true,
    },
  });

  if (!order) throw new Error("Order not found");

  if (order.isPaid) throw new Error("Order is already paid");

  await prisma.$transaction(async (tx) => {
    for (const item of order.orderItem) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          quantityInStock: { increment: -item.quantity },
        },
      });
    }

    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: paymentResut,
      },
    });
  });

  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItem: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  if (!updatedOrder) throw new Error("Order not found");
};

export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error("User is not authenticated");

  const data = await prisma.order.findMany({
    where: { userId: session.user.id! },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session.user.id! },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
