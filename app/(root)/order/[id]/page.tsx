/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { IShippingAddress } from "@/type";
import Stripe from "stripe";
import { auth } from "@/auth";

export const metadata = {
  description: "Order Details",
  title: "Order Details",
};

async function OrderDetailsPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;

  const order = await getOrderById(id);

  if (!order) notFound();

  const session = await auth();

  let client_secret = null;

  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "USD",
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as IShippingAddress,
      }}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user["role"] === "admin" || false}
    ></OrderDetailsTable>
  );
}

export default OrderDetailsPage;
