import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { delay } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";

import { ProductDetails } from "@/app/products/[slug]/product-details";

import { getProductBySlug, getRelatedProducts } from "@/wix-api/products";
import { Product } from "@/components/product";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductDetailsPageProps {
  params: {
    slug: string;
  };
}

export const generateMetadata = async ({
  params,
}: ProductDetailsPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const wixServerClient = await getWixServerClient();

  const product = await getProductBySlug(wixServerClient, slug);

  if (!product) notFound();

  const mainImage = product.media?.mainMedia?.image;

  return {
    title: product.name,
    description: "Get this products on Flow Shop",
    openGraph: {
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width,
              height: mainImage.height,
              alt: mainImage.altText || "",
            },
          ]
        : undefined,
    },
  };
};

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const { slug } = await params;

  const wixServerClient = await getWixServerClient();

  const product = await getProductBySlug(wixServerClient, slug);

  if (!product?._id) notFound();

  return (
    <main className="max-w-7xl mx-auto space-y-8 px-4 py-8">
      <ProductDetails product={product} />
      <hr />
      <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
        <RelatedProducts productId={product._id} />
      </Suspense>
    </main>
  );
};

export default ProductDetailsPage;

interface RelatedProductsPageProps {
  productId: string;
}

const RelatedProducts = async ({ productId }: RelatedProductsPageProps) => {
  await delay(2000);

  const wixServerClient = await getWixServerClient();

  const relatedProducts = await getRelatedProducts(wixServerClient, productId);

  if (!relatedProducts.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <li key={product._id}>
            <Product product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const RelatedProductsLoadingSkeleton = () => {
  return (
    <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[26rem] w-full" />
      ))}
    </div>
  );
};
