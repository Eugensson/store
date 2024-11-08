import { useMutation } from "@tanstack/react-query";

import {
  createProductReview,
  CreateProductReviewValues,
} from "@/wix-api/reviews";

import { useToast } from "@/hooks/use-toast";

import { wixBrowserClient } from "@/lib/wix-client.browser";

export const useCreateProductReview = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: CreateProductReviewValues) =>
      createProductReview(wixBrowserClient, values),
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to create review. Please try again.",
        variant: "destructive",
      });
    },
  });
};
