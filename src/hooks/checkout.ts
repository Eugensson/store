import { useState } from "react";

import { useToast } from "@/hooks/use-toast";

import { wixBrowserClient } from "@/lib/wix-client.browser";

import { getCheckoutUrlFromCurrentCart } from "@/wix-api/checkout";

export const useCartCheckout = () => {
  const { toast } = useToast();

  const [pending, setPending] = useState(false);

  const startCheckoutFlow = async () => {
    setPending(true);

    try {
      const checkoutUrl = await getCheckoutUrlFromCurrentCart(wixBrowserClient);
      window.location.href = checkoutUrl;
    } catch (error) {
      setPending(false);
      console.error(error);
      toast({
        description: "Failed to load checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { startCheckoutFlow, pending };
};
