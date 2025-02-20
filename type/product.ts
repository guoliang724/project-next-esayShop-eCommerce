import {z} from 'zod';
import { insertProductSchema } from '@/lib/validator';
import { Decimal } from '@prisma/client/runtime/library';

export type IProduct = z.infer<typeof insertProductSchema> & {
    id:string,
    star: string;
    numReviews: number; 
    isFeatured: boolean;
    createdAt?: string;
    updatedAt?: string;
  }


  export interface IProductPrice {
    price: string;
    discount?: number;
    className?: string;
  }