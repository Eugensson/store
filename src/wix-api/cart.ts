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
