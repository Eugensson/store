import { currentCart } from "@wix/ecom";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";

import { wixBrowserClient } from "@/lib/wix-client.browser";
import { addToCart, AddToCartValues, getCart } from "@/wix-api/cart";

const queryKey: QueryKey = ["cart"];

export const useCart = (initialData: currentCart.Cart | null) => {
  return useQuery({
    queryKey,
    queryFn: () => getCart(wixBrowserClient),
    initialData,
  });
};

export const useAddItemToCart = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: AddToCartValues) =>
      addToCart(wixBrowserClient, values),
    onSuccess: (data) => {
      toast({ description: "Item added to cart" });
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, data.cart);
    },
    onError: (error) => {
      toast({
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });
};
