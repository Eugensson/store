"use client";

import { MinusIcon } from "lucide-react";
import { collections } from "@wix/stores";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useOptimistic, useState, useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { ProductSort } from "@/wix-api/products";

interface SearchFilterLayoutProps {
  collections: collections.Collection[];
  children: React.ReactNode;
}

export const SearchFilterLayout = ({
  collections,
  children,
}: SearchFilterLayoutProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [optimisticFilters, setOptimisticFilters] = useOptimistic({
    collection: searchParams.getAll("collection"),
    price_min: searchParams.get("price_min") || undefined,
    price_max: searchParams.get("price_max") || undefined,
    sort: searchParams.get("sort") || undefined,
  });

  const [isPending, startTransition] = useTransition();

  const updateFilters = (updates: Partial<typeof optimisticFilters>) => {
    const newState = { ...optimisticFilters, ...updates };
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(newState).forEach(([key, value]) => {
      newSearchParams.delete(key);

      if (Array.isArray(value)) {
        value.forEach((v) => newSearchParams.append(key, v));
      } else if (value) {
        newSearchParams.set(key, value);
      }
    });

    newSearchParams.delete("page");

    startTransition(() => {
      setOptimisticFilters(newState);
      router.push(`?${newSearchParams.toString()}`);
    });
  };

  return (
    <main className="group flex flex-col justify-center items-center gap-8 px-4 py-8 lg:flex-row lg:items-start">
      <aside
        data-pending={isPending ? "" : undefined}
        className="h-fit space-y-8 lg:sticky lg:top-8 lg:w-64"
      >
        <CollectionsFilter
          collections={collections}
          selectedCollectionIds={optimisticFilters.collection}
          updateCollectionIds={(collectionIds) =>
            updateFilters({ collection: collectionIds })
          }
        />
        <PriceFilter
          minDefaultInput={optimisticFilters.price_min}
          maxDefaultInput={optimisticFilters.price_max}
          updatePriceRange={(priceMin, priceMax) =>
            updateFilters({ price_min: priceMin, price_max: priceMax })
          }
        />
      </aside>
      <div className="w-full max-w-7xl space-y-4">
        <div className="flex justify-center lg:justify-end">
          <SortFilter
            sort={optimisticFilters.sort}
            updateSort={(sort) => updateFilters({ sort })}
          />
        </div>
        {children}
      </div>
    </main>
  );
};

interface CollectionsFilterProps {
  collections: collections.Collection[];
  selectedCollectionIds: string[];
  updateCollectionIds: (collectionIds: string[]) => void;
}

const CollectionsFilter = ({
  collections,
  selectedCollectionIds,
  updateCollectionIds,
}: CollectionsFilterProps) => {
  return (
    <div className="space-y-4">
      <p className="font-bold">Collections</p>
      <ul className="space-y-1.5">
        {collections.map((collection) => {
          const collectionId = collection._id;
          if (!collectionId) return null;

          return (
            <li key={collectionId}>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <Checkbox
                  id={collectionId}
                  checked={selectedCollectionIds.includes(collectionId)}
                  onCheckedChange={(checked) => {
                    updateCollectionIds(
                      checked
                        ? [...selectedCollectionIds, collectionId]
                        : selectedCollectionIds.filter(
                            (id) => id !== collectionId
                          )
                    );
                  }}
                />
                <span className="line-clamp-1 break-all">
                  {collection.name}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {selectedCollectionIds.length > 0 && (
        <button
          onClick={() => updateCollectionIds([])}
          className="text-primary text-sm hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
};

interface PriceFilterProps {
  minDefaultInput: string | undefined;
  maxDefaultInput: string | undefined;
  updatePriceRange: (min: string | undefined, max: string | undefined) => void;
}

const PriceFilter = ({
  minDefaultInput,
  maxDefaultInput,
  updatePriceRange,
}: PriceFilterProps) => {
  const [minInput, setMinInput] = useState(minDefaultInput);
  const [maxInput, setMaxInput] = useState(maxDefaultInput);

  useEffect(() => {
    setMinInput(minDefaultInput || "");
    setMaxInput(maxDefaultInput || "");
  }, [minDefaultInput, maxDefaultInput]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updatePriceRange(minInput, maxInput);
  };

  return (
    <div className="space-y-4">
      <p className="font-bold">Price range</p>
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <Input
          type="number"
          name="min"
          placeholder="Min"
          autoComplete="off"
          value={minInput}
          onChange={(e) => setMinInput(e.target.value)}
          className="w-20"
        />
        <MinusIcon className="size-4 text-muted-foreground" />
        <Input
          type="number"
          name="max"
          placeholder="Max"
          autoComplete="off"
          value={maxInput}
          onChange={(e) => setMaxInput(e.target.value)}
          className="w-20"
        />
        <Button type="submit">Go</Button>
      </form>
      {(!!minDefaultInput || !!maxDefaultInput) && (
        <button
          onClick={() => updatePriceRange(undefined, undefined)}
          className="text-primary text-sm hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
};

interface SortFilterProps {
  sort: string | undefined;
  updateSort: (value: ProductSort) => void;
}

const SortFilter = ({ sort, updateSort }: SortFilterProps) => {
  return (
    <Select value={sort || "last_updated"} onValueChange={updateSort}>
      <SelectTrigger className="w-fit gap-4 text-start">
        <span>
          Sort by: <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="last_updated">Newest</SelectItem>
        <SelectItem value="price_asc">Price (low to high)</SelectItem>
        <SelectItem value="price_desc">Price (high to low)</SelectItem>
      </SelectContent>
    </Select>
  );
};
