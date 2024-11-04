"use client";

// import { useState } from "react";
import { currentCart } from "@wix/ecom";
import { ShoppingCartIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useCart } from "@/hooks/cart";
import { Button } from "./ui/button";

interface ShoppinCartButtonProps {
  initialData: currentCart.Cart | null;
}

export const ShoppinCartButton = ({ initialData }: ShoppinCartButtonProps) => {
  //   const [sheetOpen, setSheetOpen] = useState(false);

  const cartQuery = useCart(initialData);

  const totalQuantity =
    cartQuery?.data?.lineItems?.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    ) || 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCartIcon />
          <span className="absolute top-0 right-0 size-5 bg-primary text-xs text-primary-foreground flex justify-center items-center rounded-full">
            {totalQuantity < 10 ? totalQuantity : "9+"}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
