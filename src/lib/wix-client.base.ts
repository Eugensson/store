import {
  backInStockNotifications,
  checkout,
  currentCart,
  orders,
  recommendations,
} from "@wix/ecom";
import { files } from "@wix/media";
import { members } from "@wix/members";
import { reviews } from "@wix/reviews";
import { redirects } from "@wix/redirects";
import { products, collections } from "@wix/stores";
import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";

import { env } from "@/env";

export const getWixClient = (tokens: Tokens | undefined) => {
  return createClient({
    modules: {
      files,
      orders,
      members,
      reviews,
      products,
      checkout,
      redirects,
      currentCart,
      collections,
      recommendations,
      backInStockNotifications,
    },
    auth: OAuthStrategy({
      clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID,
      tokens,
    }),
  });
};

export type WixClient = ReturnType<typeof getWixClient>;
