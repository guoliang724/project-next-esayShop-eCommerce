import React from "react";
import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.action";

export const metadata = {
  title: "Shopping Cart",
};

async function CartPage() {
  const cart = await getMyCart();
  return (
    <>
      <CartTable cart={cart}></CartTable>
    </>
  );
}

export default CartPage;
