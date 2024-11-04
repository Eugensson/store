import { cache } from "react";
import { Tokens } from "@wix/sdk";
import { cookies } from "next/headers";

import { getWixClient } from "@/lib/wix-client.base";
import { WIX_SESSION_COOKIE } from "@/lib/constants";

export const getWixServerClient = cache(async () => {
  let tokens: Tokens | undefined;

  try {
    tokens = JSON.parse(
      (await cookies()).get(WIX_SESSION_COOKIE)?.value || "{}"
    );
  } catch (error) {
    console.error(error);
  }

  return getWixClient(tokens);
});

export const wixServerClient = getWixServerClient();
