import { products } from "@wix/stores";

import { findVariant } from "@/lib/utils";
import { WIX_STORE_APP_ID } from "@/lib/constants";
import { getWixClient } from "@/lib/wix-client.base";

export const getCart = async () => {
  const wixClient = getWixClient();

  try {
    return await wixClient.currentCart.getCurrentCart();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.details.applicationError.code === "OWNED_CART_NOT_FOUND") {
      return null;
    } else {
      throw error;
    }
  }
};

interface AddToCartValuesProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export const addToCart = async ({
  product,
  selectedOptions,
  quantity,
}: AddToCartValuesProps) => {
  const wixClient = getWixClient();

  const selectedVariant = findVariant(product, selectedOptions);

  return wixClient.currentCart.addToCurrentCart({
    lineItems: [
      {
        catalogReference: {
          appId: WIX_STORE_APP_ID,
          catalogItemId: product._id,
          options: selectedVariant
            ? { variantId: selectedVariant._id }
            : { options: selectedOptions },
        },
        quantity,
      },
    ],
  });
};
