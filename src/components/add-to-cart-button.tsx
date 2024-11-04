import { products } from "@wix/stores";

import { Button, ButtonProps } from "@/components/ui/button";

import { addToCart } from "@/wix-api/cart";
import { wixBrowserClient } from "@/lib/wix-client.browser";

interface AddToCartButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export const AddToCartButton = ({
  product,
  selectedOptions,
  quantity,
  //   className,
  ...props
}: AddToCartButtonProps) => {
  return (
    <Button
      onClick={() =>
        addToCart(wixBrowserClient, { product, selectedOptions, quantity })
      }
      {...props}
    >
      Add to cart
    </Button>
  );
};
