import Link from "next/link";
import Image from "next/image";

import logo from "@/assets/logo.png";

import { getCart } from "@/wix-api/cart";

export const Navbar = async () => {
  const cart = await getCart();

  const totalQuantity =
    cart?.lineItems.reduce((total, item) => total + (item.quantity || 0), 0) ||
    0;

  return (
    <header className="bg-background shadow-sm">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-x-4">
          <Image src={logo} alt="Flow Shop logo" width={40} height={40} />
          <span className="text-xl font-bold">Flow Shop</span>
        </Link>
        {totalQuantity} items in your cart
      </div>
    </header>
  );
};
