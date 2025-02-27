import React from "react";
import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.action";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { IShippingAddress } from "@/type";
import { getUserById } from "@/lib/actions/user.actions";
import ShippingAddressForm from "./shipping-address-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
  title: "Shipping Address",
};

async function ShippingAddressPage() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) redirect("/cart");

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm
        address={user.address as IShippingAddress}
      ></ShippingAddressForm>
    </>
  );
}

export default ShippingAddressPage;
