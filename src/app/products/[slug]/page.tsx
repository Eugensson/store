import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/wix-api/products";
import { getWixServerClient } from "@/lib/wix-client.server";

import { ProductDetails } from "@/app/products/[slug]/product-details";

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
    </main>
  );
};

export default ProductDetailsPage;
