"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface SearchFildProps {
  className?: string;
}

export const SearchFild = ({ className }: SearchFildProps) => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const q = (form.q as HTMLInputElement).value.trim();

    if (!q) return;

    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      method="GET"
      action="/shop"
      onSubmit={handleSubmit}
      className={cn("grow", className)}
    >
      <div className="relative">
        <Input name="q" placeholder="Search..." className="pe-10" />
        <Button
          type="submit"
          variant="link"
          size="icon"
          className="absolute top-1/2 right-1 -translate-y-1/2 transform"
        >
          <SearchIcon className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </form>
  );
};
