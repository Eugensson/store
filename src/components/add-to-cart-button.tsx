import { products } from "@wix/stores";
import { ShoppingCartIcon } from "lucide-react";

import { ButtonProps } from "@/components/ui/button";
import { LoadingButton } from "@/components/loading-button";

import { cn } from "@/lib/utils";
import { useAddItemToCart } from "@/hooks/cart";

interface AddToCartButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export const AddToCartButton = ({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: AddToCartButtonProps) => {
  const { mutate, isPending } = useAddItemToCart();

  return (
    <LoadingButton
      onClick={() => mutate({ product, selectedOptions, quantity })}
      className={cn("flex items-center gap-x-3", className)}
      loading={isPending}
      {...props}
    >
      <ShoppingCartIcon />
      Add to cart
    </LoadingButton>
  );
};
