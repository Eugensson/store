import { products } from "@wix/stores";

import { findVariant } from "@/lib/utils";
import { WIX_STORES_APP_ID } from "@/lib/constants";
import { WixClient } from "@/lib/wix-client.base";

export const getCart = async (wixClient: WixClient) => {
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

export interface AddToCartValues {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export const addToCart = async (
  wixClient: WixClient,
  { product, selectedOptions, quantity }: AddToCartValues
) => {
  const selectedVariant = findVariant(product, selectedOptions);

  return wixClient.currentCart.addToCurrentCart({
    lineItems: [
      {
        catalogReference: {
          appId: WIX_STORES_APP_ID,
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

export interface UpdateCartItemQuantityValues {
  productId: string;
  newQuantity: number;
}

export const updateCartItemQuantity = async (
  wixClient: WixClient,
  { productId, newQuantity }: UpdateCartItemQuantityValues
) => {
  return wixClient.currentCart.updateCurrentCartLineItemQuantity([
    {
      _id: productId,
      quantity: newQuantity,
    },
  ]);
};

export const removeCartItem = async (
  wixClient: WixClient,
  productId: string
) => {
  return wixClient.currentCart.removeLineItemsFromCurrentCart([productId]);
};

export const clearCart = async (wixClient: WixClient) => {
  try {
    return await wixClient.currentCart.deleteCurrentCart();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.details.applicationError.code === "OWNED_CART_NOT_FOUND") {
      return;
    } else {
      throw error;
    }
  }
};
