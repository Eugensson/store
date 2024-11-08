import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Product } from "@/components/product";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationBar } from "@/components/pagination-bar";

import { ProductSort, queryProducts } from "@/wix-api/products";

import { PAGE_SIZE } from "@/lib/constants";
import { getWixServerClient } from "@/lib/wix-client.server";

interface ShopPageProps {
  searchParams: {
    q?: string;
    page?: string;
    collection?: string[];
    price_min?: string;
    price_max?: string;
    sort?: string;
  };
}

export const generateMetadata = async ({
  searchParams: { q },
}: ShopPageProps): Promise<Metadata> => {
  return {
    title: q ? `Results for "${q}"` : "Products",
  };
};

const ShopPage = async ({
  searchParams: {
    q,
    page = "1",
    collection: collectionIds,
    price_min,
    price_max,
    sort,
  },
}: ShopPageProps) => {
  const title = q ? `Results for "${q}"` : "Products";

  return (
    <div className="space-y-8">
      <h1 className="text-center text-3xl md:text-4xl font-bold">{title}</h1>
      <Suspense fallback={<LoadingSkeleton />} key={`${q}-${page}`}>
        <ProductResults
          q={q}
          page={parseInt(page)}
          collectionIds={collectionIds}
          priceMin={price_min ? parseInt(price_min) : undefined}
          priceMax={price_max ? parseInt(price_max) : undefined}
          sort={sort as ProductSort}
        />
      </Suspense>
    </div>
  );
};

export default ShopPage;

interface ProductResultsProps {
  q?: string;
  page: number;
  collectionIds?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: ProductSort;
}

const ProductResults = async ({
  q,
  page,
  collectionIds,
  priceMin,
  priceMax,
  sort,
}: ProductResultsProps) => {
  const wixServerClient = getWixServerClient();

  const products = await queryProducts(wixServerClient, {
    q,
    limit: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    collectionIds,
    priceMin,
    priceMax,
    sort,
  });

  if (page > (products.totalPages || 1)) notFound();

  return (
    <div className="space-y-8 group-has-[[data-pending]]:animate-pulse">
      <p className="text-center text-xl">
        {products.totalCount}{" "}
        {products.totalCount === 1 ? "product" : "products"} found
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {products.items.map((product) => (
          <li key={product._id}>
            <Product product={product} />
          </li>
        ))}
      </ul>
      <PaginationBar currentPage={page} totalPages={products.totalPages || 1} />
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="space-y-8">
      <Skeleton className="mx-auto h-9 w-52" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <Skeleton key={i} className="h-[26rem]" />
        ))}
      </div>
    </div>
  );
};
