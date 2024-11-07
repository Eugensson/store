"use client";

import {
  Loader,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { currentCart } from "@wix/ecom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { WixImage } from "@/components/wix-image";

import {
  useCart,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItemQuantity,
} from "@/hooks/cart";
import { CheckoutButton } from "./checkout-button";

interface ShoppinCartButtonProps {
  initialData: currentCart.Cart | null;
}

export const ShoppinCartButton = ({ initialData }: ShoppinCartButtonProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const cartQuery = useCart(initialData);

  const totalQuantity =
    cartQuery?.data?.lineItems?.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    ) || 0;

  return (
    <>
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setSheetOpen(true)}>
          <ShoppingCartIcon />
          <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {totalQuantity < 10 ? totalQuantity : "9+"}
          </span>
        </Button>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              Your cart{" "}
              <span className="text-base">
                ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex grow flex-col space-y-4 overflow-y-auto pt-1">
            <ul className="space-y-4">
              {cartQuery.data?.lineItems?.map((item) => (
                <li key={item._id}>
                  <ShoppingCartItem
                    item={item}
                    onProductLinkClick={() => setSheetOpen(false)}
                  />
                </li>
              ))}
            </ul>
            {cartQuery.isPending && (
              <Loader className="mx-auto size-6 animate-spin text-muted-foreground" />
            )}
            {cartQuery.isError && (
              <p className="text-center text-destructive">
                {cartQuery.error.message}
              </p>
            )}
            {!cartQuery.isPending && !cartQuery.data?.lineItems?.length && (
              <div className="flex grow justify-center items-center text-center">
                <div className="space-y-1.5">
                  <p className="text-lg font-semibold">Your cart is empty</p>
                  <Link
                    href="/shop"
                    className="text-primary hover:underline"
                    onClick={() => setSheetOpen(false)}
                  >
                    Start shopping now
                  </Link>
                </div>
              </div>
            )}
          </div>
          <hr />
          <div className="flex justify-between items-center gap-4 px-0">
            <div className="space-y-0.5">
              <p className="text-sm">Subtotal amount:</p>
              <p className="font-bold">
                {/* @ts-expect-error */}
                {cartQuery.data?.subtotal?.formattedConvertedAmount}
              </p>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes are calculated at checkout
              </p>
            </div>
            <CheckoutButton
              size="lg"
              disabled={!totalQuantity || cartQuery.isFetching}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

interface ShoppinCartItemProps {
  item: currentCart.LineItem;
  onProductLinkClick: () => void;
}

const ShoppingCartItem = ({
  item,
  onProductLinkClick,
}: ShoppinCartItemProps) => {
  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const productId = item._id;

  if (!productId) return null;

  const slug = item.url?.split("/").pop();

  const quantityLimitReached =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity >= item.availability.quantityAvailable;

  return (
    <article className="flex items-center gap-x-4">
      <div className="relative size-fit flex-none">
        <Link href={`/products/${slug}`} onClick={onProductLinkClick}>
          <WixImage
            mediaIdentifier={item.image}
            width={110}
            height={110}
            alt={item.productName?.translated || "Product image"}
            className="flex-none bg-secondary"
          />
        </Link>
        <button
          className="absolute -top-1 -right-1 bg-background border p-0.5"
          onClick={() => removeItemMutation.mutate(productId)}
        >
          <XIcon className="size-4" />
        </button>
      </div>
      <div className="space-y-1.5 text-sm">
        <Link href={`/products/${slug}`} onClick={onProductLinkClick}>
          <p className="font-bold">{item.productName?.translated || "Item"}</p>
        </Link>
        {!!item.descriptionLines?.length && (
          <p>
            {item.descriptionLines
              .map(
                (line) =>
                  line.colorInfo?.translated || line.plainText?.translated
              )
              .join(", ")}
          </p>
        )}
        <div className="flex items-center gap-x-2">
          {item.quantity} x {item.price?.formattedConvertedAmount}
          {item.fullPrice && item.fullPrice.amount !== item.price?.amount && (
            <span className="text-muted-foreground line-through">
              {item.fullPrice.formattedConvertedAmount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-x-1.5">
          <Button
            size="sm"
            variant="outline"
            disabled={item.quantity === 1}
            onClick={() =>
              updateQuantityMutation.mutate({
                productId,
                newQuantity: !item.quantity ? 0 : item.quantity - 1,
              })
            }
          >
            <MinusIcon className="size-4" />
          </Button>
          <span>{item.quantity}</span>
          <Button
            size="sm"
            variant="outline"
            disabled={quantityLimitReached}
            onClick={() =>
              updateQuantityMutation.mutate({
                productId,
                newQuantity: !item.quantity ? 1 : item.quantity + 1,
              })
            }
          >
            <PlusIcon className="size-4" />
          </Button>
          {quantityLimitReached && <span>Quantity limit reached</span>}
        </div>
      </div>
    </article>
  );
};
