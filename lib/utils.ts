import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function covertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function formatError(error: any) {
  if (error.name === "ZodError") {
    const filedErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );

    return filedErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const field = error.meta?.target ? error.meta.target[0] : "Field";

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exsit`;
  } else {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

export function round2(value: number | string) {
  if (typeof value === "string") {
    return Math.round(Number(value) * 100) / 100;
  } else if (typeof value === "number") {
    return Math.round(value * 100) / 100;
  } else {
    throw new Error("Input must be a number or a string");
  }
}
