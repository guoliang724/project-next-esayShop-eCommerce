import {z} from 'zod';
import { formatNumberWithDecimal } from './utils';

const currency = z.string().refine((v)=>/^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(v))),"Price must have two decimal places");

export const insertProductSchema = z.object({
  name: z.string().min(3,"Name must be at least 3 characters long"),
  productNumber: z.number().int().positive(),
    description: z.string().min(3,"Description must be at least 3 characters long"),
    details: z.string().min(3,"Details must be at least 3 characters long"),
    price:currency,
    banner: z.string(),
    brand: z.string().min(3,"Brand must be at least 3 characters long"),
    category: z.string().min(3,"Category must be at least 3 characters long"),
    quantityInStock: z.number(),
    images: z.array(z.string().min(1,"Images must have at least 1 image")),
    isFeatured: z.boolean(),
});
    