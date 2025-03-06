"use client";
import { useFormStatus } from "react-dom";
import { Check, Loader } from "lucide-react";
import { createOrder } from "@/lib/actions/order.actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function PlaceOrderForm() {
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await createOrder();
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-f h-4" />
        )}
        {"  "}Place Order
      </Button>
    );
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
}

export default PlaceOrderForm;
