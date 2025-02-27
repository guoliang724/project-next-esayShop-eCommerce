import { z } from "zod";
import {
  insertProductSchema,
  InsertCartSchema,
  CartItemSchema,
  shippingAddressSchema,
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
