"use client";

import { ICart, ICartItem } from "@/type";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { useTransition } from "react";

const AddToCart = ({ item, cart }: { item: ICartItem; cart?: ICart }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [ispPending, startTransition] = useTransition();

  const handleAddtoCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }

      toast({
        description: res.message,
        action: (
          <ToastAction
            className="bg-primary text-white hover;bg-gray-800"
            onClick={() => router.push("/cart")}
            altText="Go to Cart"
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });
  };

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  const handleRemoveCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(existItem.productId);

      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });

      return;
    });
  };

  return existItem ? (
    <div>
      <Button variant="outline" type="button" onClick={handleRemoveCart}>
        {ispPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.quantity}</span>
      <Button variant="outline" type="button" onClick={handleAddtoCart}>
        {ispPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddtoCart}>
      {ispPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
