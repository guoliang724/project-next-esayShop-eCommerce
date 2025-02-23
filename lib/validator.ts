import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (v) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(v))),
    "Price must have two decimal places"
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  productNumber: z.number(),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  details: z.string().min(3, "Details must be at least 3 characters long"),
  price: currency,
  banner: z.string(),
  brand: z.string().min(3, "Brand must be at least 3 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  quantityInStock: z.number(),
  images: z.array(z.string().min(1, "Images must have at least 1 image")),
  isFeatured: z.boolean(),
});

export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be 3 charactors"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
