import React from "react";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { IShippingAddress } from "@/type";

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
  console.log("orderDetailspage", id);
  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as IShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
    ></OrderDetailsTable>
  );
}

export default OrderDetailsPage;
