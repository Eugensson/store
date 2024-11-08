import Link from "next/link";
import { products } from "@wix/stores";

import { Badge } from "@/components/ui/badge";
import { WixImage } from "@/components/wix-image";
import { DiscountBadge } from "@/components/discount-badge";

import { formatCurrency, formattedPrice } from "@/lib/utils";

interface ProductProps {
  product: products.Product;
}

export const Product = ({ product }: ProductProps) => {
  const mainImage = product.media?.mainMedia?.image;

  return (
    <Link href={`/products/${product.slug}`} className="border h-full bg-card">
      <div className="relative overflow-hidden">
        <WixImage
          mediaIdentifier={mainImage?.url}
          width={700}
          height={700}
          alt={mainImage?.altText}
          className="transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-4 right-4 flex flex-wrap items-center gap-2">
          {product.ribbon && <Badge>{product.ribbon}</Badge>}
          {product.discount && <DiscountBadge data={product.discount} />}
          <Badge className="bg-secondary text-secondary-foreground font-semibold">
            {formattedPrice(product)}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 p-3">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <div
          className="line-clamp-5"
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        />
      </div>
    </Link>
  );
};
