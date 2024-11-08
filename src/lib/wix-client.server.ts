import { cache } from "react";
import { files } from "@wix/media";
import { cookies } from "next/headers";
import { ApiKeyStrategy, createClient, Tokens } from "@wix/sdk";

import { env } from "@/env";

import { WIX_SESSION_COOKIE } from "@/lib/constants";

import { getWixClient } from "@/lib/wix-client.base";

export const getWixServerClient = cache(() => {
  let tokens: Tokens | undefined;

  try {
    tokens = JSON.parse(cookies().get(WIX_SESSION_COOKIE)?.value || "{}");
  } catch (error) {
    console.error(error);
  }

  return getWixClient(tokens);
});

export const getWixAdminClient = cache(async () => {
  const wixClient = createClient({
    modules: {
      files,
    },
    auth: ApiKeyStrategy({
      apiKey: env.WIX_API_KEY,
      siteId: env.NEXT_PUBLIC_WIX_SITE_ID,
    }),
  });

  return wixClient;
});
