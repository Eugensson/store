import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";

import banner from "@/assets/banner.jpg";
import { Product } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { queryProducts } from "@/wix-api/products";
import { getCollectionBySlug } from "@/wix-api/collections";

import { getWixServerClient } from "@/lib/wix-client.server";

const HomePage = () => {
  return (
    <main className="max-w-7xl mx-auto px-5 py-10 space-y-10">
      <div className="flex items-center bg-secondary md:h-96">
        <div className="p-10 space-y-7 text-center md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Fill the void in your heart
          </h1>
          <p>
            Tough day? Credit card maxed out? Buy some not expensive stuff and
            become happy again.
          </p>
          <Button asChild>
            <Link href="/shop">
              Shop Now <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
        <div className="relative hidden md:block w-1/2 h-full">
          <Image
            priority
            src={banner}
            alt="Flow Shop Banner"
            className="h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent" />
        </div>
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
};

export default HomePage;

const FeaturedProducts = async () => {
  const wixClient = await getWixServerClient();

  const collection = await getCollectionBySlug(wixClient, "featured-products");

  if (!collection?._id) return null;

  const featuredProducts = await queryProducts(wixClient, {
    collectionIds: collection?._id,
  });

  if (!featuredProducts.items.length) return null;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Featured Products</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {featuredProducts.items.map((product) => (
          <li key={product._id}>
            <Product product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-[70px]">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-[26rem]" />
      ))}
    </div>
  );
};
