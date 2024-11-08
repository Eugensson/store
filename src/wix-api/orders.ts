import { WixClient } from "@/lib/wix-client.base";

export const getOrder = async (wixClient: WixClient, orderId: string) => {
  try {
    return await wixClient.orders.getOrder(orderId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.details.applicationError.code === "NOT_FOUND") {
      return null;
    } else {
      throw error;
    }
  }
};

export interface GetUserOrderFilters {
  limit?: number;
  cursor?: string | null;
}

export const getUserOrders = async (
  wixClient: WixClient,
  { limit, cursor }: GetUserOrderFilters
) => {
  return wixClient.orders.searchOrders({
    search: {
      cursorPaging: {
        limit,
        cursor,
      },
    },
  });
};