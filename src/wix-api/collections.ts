import { cache } from "react";
import { collections } from "@wix/stores";

import { WixClient } from "@/lib/wix-client.base";

export const getCollectionBySlug = cache(
  async (wixClient: WixClient, slug: string) => {
    const { collection } = await wixClient.collections.getCollectionBySlug(
      slug
    );

    return collection || null;
  }
);

export const getCollections = cache(
  async (wixClient: WixClient): Promise<collections.Collection[]> => {
    const collections = await wixClient.collections
      .queryCollections()
      .ne("_id", "00000000-000000-000000-000000000001") // All products
      .ne("_id", "c68b4e3b-df48-6b25-32a8-f21c4610583f") // Featured products
      .find();

    return collections.items;
  }
);
