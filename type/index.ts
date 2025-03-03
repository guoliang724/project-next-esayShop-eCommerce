import { z } from "zod";
import {
  insertProductSchema,
  InsertCartSchema,
  CartItemSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
} from "@/lib/validator";

export type IProduct = z.infer<typeof insertProductSchema> & {
  id: string;
  star: string;
  numReviews: number;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export interface IProductPrice {
  price: string;
  discount?: number;
  className?: string;
}

export type ICart = z.infer<typeof InsertCartSchema>;

export type ICartItem = z.infer<typeof CartItemSchema>;

export type IShippingAddress = z.infer<typeof shippingAddressSchema>;

export type IOrderItem = z.infer<typeof insertOrderItemSchema>;

export type IOrder = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItem: IOrderItem[];
  user: {
    name: string;
    email: string;
  };
};
