import { products } from "@wix/stores";

import { Badge } from "@/components/ui/badge";

interface DiscountBadgeProps {
  data: products.Discount;
}

export const DiscountBadge = ({ data }: DiscountBadgeProps) => {
  if (data.type !== "PERCENT") return null;

  return <Badge>-{data.value}%</Badge>;
};
