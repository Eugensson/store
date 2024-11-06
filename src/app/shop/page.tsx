import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Product } from "@/components/product";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationBar } from "@/components/pagination-bar";

import { queryProducts } from "@/wix-api/products";

import { delay } from "@/lib/utils";
import { PAGE_SIZE } from "@/lib/constants";
import { getWixServerClient } from "@/lib/wix-client.server";

interface ShopPageProps {
  searchParams: { q?: string; page?: string };
}

export const generateMetadata = ({
  searchParams: { q },
}: ShopPageProps): Metadata => {
  return {
    title: q ? `Results for "${q}"` : "Products",
  };
};

const ShopPage = async ({ searchParams: { q, page = "1" } }: ShopPageProps) => {
  const title = q ? `Results for "${q}"` : "Products";

  return (
    <main className="flex flex-col justify-center items-center gap-8 px-4 py-8 lg:flex-row lg:items-start">
      <div>filter sidebar</div>
      <div className="w-full max-w-7xl space-y-4">
        <div className="flex justify-center lg:justify-end">sort filter</div>
        <div className="space-y-8">
          <h1 className="text-center text-3xl md:text-4xl font-bold">
            {title}
          </h1>
          <Suspense fallback={<LoadingSkeleton />} key={`${q}-${page}`}>
            <ProductResults q={q} page={parseInt(page)} />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default ShopPage;

interface ProductResultsProps {
  q?: string;
  page: number;
}

const ProductResults = async ({ q, page }: ProductResultsProps) => {
  await delay(1000);

  const wixServerClient = await getWixServerClient();

  const products = await queryProducts(wixServerClient, {
    q,
    limit: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  if (page > (products.totalPages || 1)) notFound();

  return (
    <div className="space-y-8">
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
