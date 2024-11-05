import { useMutation } from "@tanstack/react-query";

import {
  BackInStockNotificationRequestValues,
  createBackInStockNotificationRequest,
} from "@/wix-api/back-in-stock-notifications";
import { wixBrowserClient } from "@/lib/wix-client.browser";

import { useToast } from "@/hooks/use-toast";

export const useCreateBackInStockNotificationRequest = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (value: BackInStockNotificationRequestValues) =>
      createBackInStockNotificationRequest(wixBrowserClient, value),
    onSuccess: () => {
      toast({ description: "Back in stock notification request created" });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error(error);
      if (
        error.details.applicationError.code ===
        "BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS"
      ) {
        toast({
          description: "You are already subscribed to this product",
          variant: "destructive",
        });
      } else {
        toast({
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
  });
};
