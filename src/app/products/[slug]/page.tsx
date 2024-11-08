import { Metadata } from "next";
import { Suspense } from "react";
import { products } from "@wix/stores";
import { notFound } from "next/navigation";

import { Product } from "@/components/product";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateProductReviewButton } from "@/components/reviews/create-product-review-button";

import {
  ProductReviews,
  ProductReviewsLoadingSkeleton,
} from "@/app/products/[slug]/product-reviews";
import { ProductDetails } from "@/app/products/[slug]/product-details";

import { getWixServerClient } from "@/lib/wix-client.server";

import { getLoggedInMember } from "@/wix-api/members";
import { getProductReviews } from "@/wix-api/reviews";
import { getProductBySlug, getRelatedProducts } from "@/wix-api/products";

interface ProductDetailsPageProps {
  params: {
    slug: string;
  };
}

export const generateMetadata = async ({
  params: { slug },
}: ProductDetailsPageProps): Promise<Metadata> => {
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

const ProductDetailsPage = async ({
  params: { slug },
}: ProductDetailsPageProps) => {
  const wixServerClient = getWixServerClient();

  const product = await getProductBySlug(wixServerClient, slug);

  if (!product?._id) notFound();

  return (
    <main className="max-w-7xl mx-auto space-y-8 px-4 py-8">
      <ProductDetails product={product} />
      <hr />
      <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
        <RelatedProducts productId={product._id} />
      </Suspense>
      <hr />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Buyer reviews</h2>
        <Suspense fallback={<ProductReviewsLoadingSkeleton />}>
          <ProductReviewsSection product={product} />
        </Suspense>
      </div>
    </main>
  );
};

export default ProductDetailsPage;

interface RelatedProductsPageProps {
  productId: string;
}

const RelatedProducts = async ({ productId }: RelatedProductsPageProps) => {
  const wixServerClient = getWixServerClient();

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

interface ProductReviewsSectionProps {
  product: products.Product;
}

const ProductReviewsSection = async ({
  product,
}: ProductReviewsSectionProps) => {
  if (!product._id) return null;

  const wixClient = getWixServerClient();

  const loggedInMember = await getLoggedInMember(wixClient);

  const existingReview = loggedInMember?.contactId
    ? (
        await getProductReviews(wixClient, {
          productId: product._id,
          contactId: loggedInMember.contactId,
        })
      ).items[0]
    : null;

  return (
    <div className="space-y-5">
      <CreateProductReviewButton
        product={product}
        loggedInMember={loggedInMember}
        hasExistingReview={!!existingReview}
      />
      <ProductReviews product={product} />
    </div>
  );
};
