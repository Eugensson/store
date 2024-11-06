import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Product } from "@/components/product";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationBar } from "@/components/pagination-bar";

import { queryProducts } from "@/wix-api/products";
import { getCollectionBySlug } from "@/wix-api/collections";

import { delay } from "@/lib/utils";
import { PAGE_SIZE } from "@/lib/constants";
import { getWixServerClient } from "@/lib/wix-client.server";

interface CollectionPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const { slug } = await params;

  const wixServerClient = await getWixServerClient();
  const collection = await getCollectionBySlug(wixServerClient, slug);

  if (!collection) notFound();

  const banner = collection.media?.mainMedia?.image;

  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      images: banner ? [{ url: banner.url }] : [],
    },
  };
};

const CollectionPage = async ({
  params,
  searchParams,
}: CollectionPageProps) => {
  const { slug } = await params;
  const { page = "1" } = await searchParams;

  const wixServerClient = await getWixServerClient();
  const collection = await getCollectionBySlug(wixServerClient, slug);

  if (!collection?._id) notFound();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Products</h2>
      <Suspense fallback={<LoadingSkeleton />} key={page}>
        <Products collectionId={collection._id} page={parseInt(page)} />
      </Suspense>
    </div>
  );
};

export default CollectionPage;

interface ProductsProps {
  collectionId: string;
  page: number;
}

const Products = async ({ collectionId, page }: ProductsProps) => {
  await delay(2000);

  const wixServerClient = await getWixServerClient();

  const collectionProducts = await queryProducts(wixServerClient, {
    collectionIds: collectionId,
    limit: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  if (!collectionProducts.length) notFound();

  if (page > (collectionProducts.totalPages || 1)) notFound();

  return (
    <div className="space-y-8">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {collectionProducts.items.map((product) => (
          <li key={product._id}>
            <Product product={product} />
          </li>
        ))}
      </ul>
      <PaginationBar
        currentPage={page}
        totalPages={collectionProducts.totalPages || 1}
      />
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Skeleton key={i} className="h-[26rem] w-full" />
      ))}
    </div>
  );
};
