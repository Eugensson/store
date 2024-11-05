import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Product } from "@/components/product";
import { Skeleton } from "@/components/ui/skeleton";

import { queryProducts } from "@/wix-api/products";
import { getCollectionBySlug } from "@/wix-api/collections";

import { delay } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export const generateMetadata = async ({
  params,
}: CollectionPageProps): Promise<Metadata> => {
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

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { slug } = await params;
  const wixServerClient = await getWixServerClient();
  const collection = await getCollectionBySlug(wixServerClient, slug);

  if (!collection?._id) notFound();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Products</h2>
      <Suspense fallback={<LoadingSkeleton />}>
        <Products collectionId={collection._id} />
      </Suspense>
    </div>
  );
};

export default CollectionPage;

interface ProductsProps {
  collectionId: string;
}

const Products = async ({ collectionId }: ProductsProps) => {
  await delay(2000);

  const wixServerClient = await getWixServerClient();

  const collectionProducts = await queryProducts(wixServerClient, {
    collectionIds: collectionId,
  });

  if (!collectionProducts.length) notFound();

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {collectionProducts.items.map((product) => (
        <li key={product._id}>
          <Product product={product} />
        </li>
      ))}
    </ul>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-[26rem] w-full" />
      ))}
    </div>
  );
};
