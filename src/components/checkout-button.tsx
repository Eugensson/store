"use client";

import { useCartCheckout } from "@/hooks/checkout";

import { ButtonProps } from "@/components/ui/button";
import { LoadingButton } from "@/components/loading-button";

export const CheckoutButton = (props: ButtonProps) => {
  const { startCheckoutFlow, pending } = useCartCheckout();

  return (
    <LoadingButton {...props} onClick={startCheckoutFlow} loading={pending}>
      Checkout
    </LoadingButton>
  );
};
