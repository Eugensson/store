import Link from "next/link";
import Image from "next/image";
import { products } from "@wix/stores";
import { media as wixMedia } from "@wix/sdk";

interface ProductProps {
  product: products.Product;
}

export const Product = ({ product }: ProductProps) => {
  const mainImage = product.media?.mainMedia?.image;

  const resizedImageUrl = mainImage?.url
    ? wixMedia.getScaledToFitImageUrl(mainImage.url, 700, 700, {})
    : null;

  return (
    <Link href={`/products/${product.slug}`} className="border h-full">
      <div className="overflow-hidden">
        <Image
          src={resizedImageUrl || "/placeholder.png"}
          alt={mainImage?.altText || "Product Image"}
          width={700}
          height={700}
          className="transition-transform duration-300 hover:scale-105"
        />
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