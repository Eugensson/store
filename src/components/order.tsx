import Link from "next/link";
import { orders } from "@wix/ecom";
import { formatDate } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { WixImage } from "@/components/wix-image";

import { cn } from "@/lib/utils";
import { SUPPORT_EMAIL } from "@/lib/constants";

interface OrderProps {
  order: orders.Order;
}

export const Order = ({ order }: OrderProps) => {
  const paymentStatusMap: Record<orders.PaymentStatus, string> = {
    [orders.PaymentStatus.PAID]: "Paid",
    [orders.PaymentStatus.NOT_PAID]: "Not paid",
    [orders.PaymentStatus.FULLY_REFUNDED]: "Refunded",
    [orders.PaymentStatus.PARTIALLY_PAID]: "Partially paid",
    [orders.PaymentStatus.PARTIALLY_REFUNDED]: "Partially refunded",
    [orders.PaymentStatus.PENDING]: "Pending",
    [orders.PaymentStatus.UNSPECIFIED]: "No information",
  };

  const fulfillmentStatusMap: Record<orders.FulfillmentStatus, string> = {
    [orders.FulfillmentStatus.FULFILLED]: "Delivered",
    [orders.FulfillmentStatus.NOT_FULFILLED]: "Not sent",
    [orders.FulfillmentStatus.PARTIALLY_FULFILLED]: "Partially delivered",
  };

  const paymentStatus = order.paymentStatus
    ? paymentStatusMap[order.paymentStatus]
    : null;

  const fulfillmentStatus = order.fulfillmentStatus
    ? fulfillmentStatusMap[order.fulfillmentStatus]
    : null;

  const shippinDestination = order.shippingInfo?.logistics?.shippingDestination;

  return (
    <div className="w-full space-y-4 border p-4">
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-bold">Order #{order.number}</span>
        {order._createdDate && (
          <span>{formatDate(order._createdDate, "MMM d, yyyy")}</span>
        )}
        <Link
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
            `Order #${order.number} help`
          )}&body=${encodeURIComponent(
            `I need help with order #${order.number}`
          )}\n\n<Describe your problem>`}
          className="ms-auto text-sm hover:underline"
        >
          Need help?
        </Link>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="basis-96">
          <div className="space-y-0.5">
            <div className="flex items-center gap-4 font-semibold">
              <span>
                Subtotal: {order.priceSummary?.subtotal?.formattedAmount}
              </span>
              <Badge
                className={cn(
                  "bg-secondary text-secondary-foreground",
                  order.paymentStatus === orders.PaymentStatus.NOT_PAID &&
                    "bg-red-500 text-white",
                  order.paymentStatus === orders.PaymentStatus.PAID &&
                    "bg-green-500 text-white"
                )}
              >
                {paymentStatus || "No information"}
              </Badge>
            </div>
            <div className="font-semibold">
              {fulfillmentStatus || "Not information"}
            </div>
          </div>
          <ul className="devide-y">
            {order.lineItems?.map((item) => (
              <li key={item._id}>
                <OrderItem item={item} />
              </li>
            ))}
          </ul>
        </div>
        {shippinDestination && (
          <div className="space-y-0.5">
            <p className="font-semibold">Delivery address:</p>
            <p>
              {shippinDestination.contactDetails?.firstName}
              {""}
              {shippinDestination.contactDetails?.lastName}
            </p>
            <p>
              {shippinDestination.address?.streetAddress?.name}{" "}
              {shippinDestination.address?.streetAddress?.number}
            </p>
            <p>
              {shippinDestination.address?.postalCode}{" "}
              {shippinDestination.address?.city}
            </p>
            <p>
              {shippinDestination.address?.subdivision ||
                shippinDestination.address?.country}
            </p>
            <p className="font-semibold">{order.shippingInfo?.title}</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface OrderItemProps {
  item: orders.OrderLineItem;
}

const OrderItem = ({ item }: OrderItemProps) => {
  return (
    <div className="flex flex-wrap gap-4 py-4 last:pb-0">
      <WixImage
        mediaIdentifier={item.image}
        width={110}
        height={110}
        alt={item.productName?.translated || "Product image"}
        className="flex-none bg-secondary"
      />
      <div className="space-y-0.5">
        <p className="line-clamp-1 font-bold">{item.productName?.translated}</p>
        <p className="">
          {item.quantity} x {item.price?.formattedAmount}
        </p>
        {!!item.descriptionLines?.length && (
          <p>
            {item.descriptionLines
              .map(
                (line) =>
                  line.colorInfo?.translated || line.plainText?.translated
              )
              .join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};
