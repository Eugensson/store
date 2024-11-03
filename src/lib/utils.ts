import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const delay = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const formatCurrency = (
  price: number | string = 0,
  currency: string = "USD"
) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(price));
};
