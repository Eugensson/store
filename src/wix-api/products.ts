import { cache } from "react";

import { WixClient } from "@/lib/wix-client.base";

type ProductSort = "last_updated" | "price_asc" | "price_desc";

interface QueryProductsFilters {
  collectionIds?: string[] | string;
  sort?: ProductSort;
  skip?: number;
  limit?: number;
}

export const queryProducts = async (
  wixClient: WixClient,
  {
    collectionIds,
    sort = "last_updated",
    skip = 0,
    limit = 10,
  }: QueryProductsFilters
) => {
  let query = wixClient.products.queryProducts();

  const collectionIdsArray = collectionIds
    ? Array.isArray(collectionIds)
      ? collectionIds
      : [collectionIds]
    : [];

  if (collectionIdsArray.length > 0) {
    query = query.hasSome("collectionIds", collectionIdsArray);
  }

  switch (sort) {
    case "price_asc":
      query = query.ascending("price");
      break;
    case "price_desc":
      query = query.descending("price");
      break;
    case "last_updated":
      query = query.descending("lastUpdated");
      break;
  }

  if (limit) query = query.limit(limit);
  if (skip) query = query.skip(skip);

  return await query.find();
};

export const getProductBySlug = cache(
  async (wixClient: WixClient, slug: string) => {
    const { items } = await wixClient.products
      .queryProducts()
      .eq("slug", slug)
      .limit(1)
      .find();

    const product = items[0];

    if (!product || !product.visible) return null;

    return product;
  }
);
