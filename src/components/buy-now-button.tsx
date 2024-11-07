"use client";

import { products } from "@wix/stores";
import { CreditCardIcon } from "lucide-react";

import { ButtonProps } from "@/components/ui/button";
import { LoadingButton } from "@/components/loading-button";

import { cn } from "@/lib/utils";

import { useQuickBuy } from "@/hooks/checkout";

interface BuyNowButtonProps extends ButtonProps {
  product: products.Product;
  quantity: number;
  selectedOptions: Record<string, string>;
}

export const BuyNowButton = ({
  product,
  quantity,
  selectedOptions,
  className,
  ...props
}: BuyNowButtonProps) => {
  const { startCheckoutFlow, pending } = useQuickBuy();

  return (
    <LoadingButton
      {...props}
      onClick={() => startCheckoutFlow({ product, quantity, selectedOptions })}
      loading={pending}
      variant="secondary"
      className={cn("flex items-center gap-x-2", className)}
    >
      <CreditCardIcon />
      Buy now
    </LoadingButton>
  );
};
