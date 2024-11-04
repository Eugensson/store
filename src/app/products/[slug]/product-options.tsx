import { products } from "@wix/stores";

import { Label } from "@/components/ui/label";
import { checkInStock, cn } from "@/lib/utils";

interface ProductOptionsProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (options: Record<string, string>) => void;
}

export const ProductOptions = ({
  product,
  selectedOptions,
  setSelectedOptions,
}: ProductOptionsProps) => {
  return (
    <div className="space-y-2.5">
      {product.productOptions?.map((option) => (
        <fieldset key={option.name} className="space-y-1.5">
          <legend>
            <Label asChild>
              <span>{option.name}</span>
            </Label>
            <div className="flex flex-wrap items-center gap-1.5">
              {option.choices?.map((choice) => (
                <div key={choice.description}>
                  <input
                    type="radio"
                    name={option.name}
                    id={choice.description}
                    value={choice.description}
                    checked={
                      selectedOptions[option.name || ""] === choice.description
                    }
                    onChange={() =>
                      setSelectedOptions({
                        ...selectedOptions,
                        [option.name || ""]: choice.description || "",
                      })
                    }
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={choice.description}
                    className={cn(
                      "flex min-w-14 cursor-pointer items-center justify-center gap-1.5 border p-2 peer-checked:border-primary",
                      !checkInStock(product, {
                        ...selectedOptions,
                        [option.name || ""]: choice.description || "",
                      }) && "opacity-50"
                    )}
                  >
                    {option.optionType === products.OptionType.color && (
                      <span
                        className="size-4 rounded-full border"
                        style={{ backgroundColor: choice.value }}
                      />
                    )}
                    <span>{choice.description}</span>
                  </Label>
                </div>
              ))}
            </div>
          </legend>
        </fieldset>
      ))}
    </div>
  );
};