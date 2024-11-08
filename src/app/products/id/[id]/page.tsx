import { notFound, redirect } from "next/navigation";

import { getProductById } from "@/wix-api/products";

import { getWixServerClient } from "@/lib/wix-client.server";

interface ProductIdDatailsProps {
  params: { id: string };
  searchParams: any;
}

const ProductIdDatailsPage = async ({
  params,
  searchParams,
}: ProductIdDatailsProps) => {
  if (params.id === "someId") {
    redirect(`/products/i-m-a-product-1?${new URLSearchParams(searchParams)}`);
  }

  const product = await getProductById(getWixServerClient(), params.id);

  if (!product) notFound();

  redirect(`/products/${product.slug}?${new URLSearchParams(searchParams)}`);
};

export default ProductIdDatailsPage;
