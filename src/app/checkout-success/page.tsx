import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Order } from "@/components/order";
import { ClearCart } from "@/app/checkout-success/clear-cart";

import { getWixServerClient } from "@/lib/wix-client.server";

import { getOrder } from "@/wix-api/orders";
import { getLoggedInMember } from "@/wix-api/members";

export const metadata: Metadata = {
  title: "Checkout Success",
};

interface CheckoutSuccessPageProps {
  searchParams: { orderId: string };
}

const CheckoutSuccessPage = async ({
  searchParams: { orderId },
}: CheckoutSuccessPageProps) => {
  const wixClient = await getWixServerClient();

  const [order, loggedInMember] = await Promise.all([
    getOrder(wixClient, orderId),
    getLoggedInMember(wixClient),
  ]);

  if (!order) notFound();

  const orderCreatedDate = order._createdDate
    ? new Date(order._createdDate)
    : null;

  return (
    <main className="mx-auto max-w-3xl flex flex-col items-center space-y-4 px-4 py-8">
      <h1 className="text-3xl font-bold">We recived your order!</h1>
      <p>A summary of your order was sent to your email address.</p>
      <h2 className="text-2xl font-bold">Order details</h2>
      <Order order={order} />
      {loggedInMember && (
        <Link href="/profile" className="block text-primary hover:underline">
          View all your orders
        </Link>
      )}
      {orderCreatedDate &&
        orderCreatedDate.getTime() > Date.now() - 60_000 * 5 && <ClearCart />}
    </main>
  );
};

export default CheckoutSuccessPage;
