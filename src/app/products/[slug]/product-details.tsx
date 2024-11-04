"use client";

import { useState } from "react";
import { products } from "@wix/stores";
import { InfoIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { ProductMedia } from "@/app/products/[slug]/product-media";
import { ProductPrice } from "@/app/products/[slug]/product-price";
import { ProductOptions } from "@/app/products/[slug]/product-options";

import { checkInStock, findVariant } from "@/lib/utils";

interface ProductDetailsProps {
  product: products.Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(
    product.productOptions
      ?.map((option) => ({
        [option.name || ""]: option.choices?.[0].description || "",
      }))
      ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) || {}
  );

  const selectedVariant = findVariant(product, selectedOptions);

  const inStock = checkInStock(product, selectedOptions);

  const avalibleQuantity =
    selectedVariant?.stock?.quantity ?? product.stock?.quantity;

  const avalibleQuantityExceeded =
    !!avalibleQuantity && quantity > avalibleQuantity;

  const selectedOptionsMedia = product.productOptions?.flatMap((option) => {
    const selectedChoice = option.choices?.find(
      (choice) => choice.description === selectedOptions[option.name || ""]
    );

    return selectedChoice?.media?.items ?? [];
  });

  return (
    <div className="flex flex-col md:flex-row gap-10 lg:gap-20">
      <ProductMedia
        media={
          !!selectedOptionsMedia?.length
            ? selectedOptionsMedia
            : product.media?.items
        }
      />
      <div className="basis-3/5 space-y-5">
        <div className="space-y-2.5">
          <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
          {product.brand && (
            <p className="text-muted-foreground">{product.brand}</p>
          )}
          {product.ribbon && <Badge className="block">{product.ribbon}</Badge>}
        </div>
        {product.description && (
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="prose dark:prose-invert"
          />
        )}
        <ProductPrice product={product} selectedVariant={selectedVariant} />
        <ProductOptions
          product={product}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <div>Selected Options: {JSON.stringify(selectedOptions)}</div>
        <div>Variant: {JSON.stringify(selectedVariant?.choices)}</div>
        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex items-center gap-2.5">
            <Input
              name="quantity"
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={!inStock}
              className="w-24"
            />
            {!!avalibleQuantity &&
              (avalibleQuantityExceeded || avalibleQuantity < 10) && (
                <span className="text-destructive">
                  Only {avalibleQuantity} left in stock
                </span>
              )}
          </div>
        </div>
        {!!product.additionalInfoSections?.length && (
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <InfoIcon className="size-5" />
              <span>Additional product information</span>
            </span>
            <Accordion type="multiple">
              {product.additionalInfoSections.map((section) => (
                <AccordionItem value={section.title || ""} key={section.title}>
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  <AccordionContent>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: section.description || "",
                      }}
                      className="text-sm text-muted-foreground prose dark:prose-invert"
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};
