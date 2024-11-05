import { z } from "zod";
import { products } from "@wix/stores";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/loading-button";
import { Button, ButtonProps } from "@/components/ui/button";

import { env } from "@/env";

import { requiredString } from "@/lib/validation";

import { useCreateBackInStockNotificationRequest } from "@/hooks/back-in-stock";

const formShema = z.object({
  email: requiredString.email(),
});

type FormValues = z.infer<typeof formShema>;

interface BackInStockNotificationButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
}

export const BackInStockNotificationButton = ({
  product,
  selectedOptions,
  ...props
}: BackInStockNotificationButtonProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formShema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useCreateBackInStockNotificationRequest();

  const onSubmit = async ({ email }: FormValues) => {
    mutation.mutate({
      email,
      itemUrl: env.NEXT_PUBLIC_BASE_URL + "/products/" + product.slug,
      product,
      selectedOptions,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>Notify when available</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notify when available</DialogTitle>
          <DialogDescription>
            Enter your email address and we&apos;ll let you know when this
            product is back in stock.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="email"
                      placeholder="john.doe@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={mutation.isPending}>
              Notify me
            </LoadingButton>
          </form>
        </Form>
        {mutation.isSuccess && (
          <div className="py-2.5 text-green-500">
            Thank you! We&apos;ll notify you when this product is back in stock.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
