import { products } from "@wix/stores";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

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

export const findVariant = (
  product: products.Product,
  selectedOptions: Record<string, string>
) => {
  if (!product.manageVariants) return null;

  return (
    product.variants?.find((variant) => {
      return Object.entries(selectedOptions).every(
        ([key, value]) => variant.choices?.[key] === value
      );
    }) || null
  );
};

export const checkInStock = (
  product: products.Product,
  selectedOptions: Record<string, string>
) => {
  const variant = findVariant(product, selectedOptions);

  return variant
    ? variant.stock?.quantity !== 0 && variant.stock?.inStock
    : product.stock?.inventoryStatus === products.InventoryStatus.IN_STOCK ||
        product.stock?.inventoryStatus ===
          products.InventoryStatus.PARTIALLY_OUT_OF_STOCK;
};
