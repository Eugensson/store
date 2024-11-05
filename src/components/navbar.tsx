import Link from "next/link";
import Image from "next/image";

import logo from "@/assets/logo.png";
import { UserButton } from "@/components/user-button";
import { MainNavigation } from "@/components/main-navigation";
import { ShoppinCartButton } from "@/components/shoppin-cart-button";

import { getCart } from "@/wix-api/cart";
import { getLoggedInMember } from "@/wix-api/members";
import { getCollections } from "@/wix-api/collections";

import { getWixServerClient } from "@/lib/wix-client.server";

export const Navbar = async () => {
  const wixClient = await getWixServerClient();

  const [cart, loggedInMember, collections] = await Promise.all([
    getCart(wixClient),
    getLoggedInMember(wixClient),
    getCollections(wixClient),
  ]);

  return (
    <header className="bg-background shadow-sm">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="flex items-center gap-x-4">
            <Image src={logo} alt="Flow Shop logo" width={40} height={40} />
            <span className="text-xl font-bold">Flow Shop</span>
          </Link>
          <MainNavigation collections={collections} />
        </div>
        <div className="flex items-center gap-x-4">
          <UserButton loggedInMember={loggedInMember} />
          <ShoppinCartButton initialData={cart} />
        </div>
      </div>
    </header>
  );
};
