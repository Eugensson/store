import { cache } from "react";

import { WixClient } from "@/lib/wix-client.base";

export type ProductSort = "last_updated" | "price_asc" | "price_desc";

interface QueryProductsFilters {
  q?: string;
  collectionIds?: string[] | string;
  sort?: ProductSort;
  priceMin?: number;
  priceMax?: number;
  skip?: number;
  limit?: number;
}

export const queryProducts = async (
  wixClient: WixClient,
  {
    q,
    collectionIds,
    sort = "last_updated",
    priceMin,
    priceMax,
    skip = 0,
    limit = 10,
  }: QueryProductsFilters
) => {
  let query = wixClient.products.queryProducts();

  if (q) {
    query = query.startsWith("name", q);
  }

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

  if (priceMin) {
    query = query.ge("priceData.price", priceMin);
  }

  if (priceMax) {
    query = query.le("priceData.price", priceMax);
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
