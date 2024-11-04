import Cookies from "js-cookie";
import { Tokens } from "@wix/sdk";

import { WIX_SESSION_COOKIE } from "@/lib/constants";
import { getWixClient } from "@/lib/wix-client.base";

const tokens: Tokens = JSON.parse(Cookies.get(WIX_SESSION_COOKIE) || "{}");

export const wixBrowserClient = getWixClient(tokens);
