import { getCollections } from "@/wix-api/collections";

import { getWixServerClient } from "@/lib/wix-client.server";

import { SearchFilterLayout } from "@/app/shop/search-filter-layout";

const ShopLayout = async ({ children }: { children: React.ReactNode }) => {
  const wixServerClient = await getWixServerClient();
  const collections = await getCollections(wixServerClient);

  return (
    <SearchFilterLayout collections={collections}>
      {children}
    </SearchFilterLayout>
  );
};

export default ShopLayout;
