import { Suspense } from "react";
import { notFound } from "next/navigation";

import { WixImage } from "@/components/wix-image";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

import { getCollectionBySlug } from "@/wix-api/collections";

import { getWixServerClient } from "@/lib/wix-client.server";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

const Layout = ({ children, params }: LayoutProps) => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CollectionsLayout params={params}>{children}</CollectionsLayout>
    </Suspense>
  );
};

export default Layout;

const CollectionsLayout = async ({
  children,
  params: { slug },
}: LayoutProps) => {
  const serverClient = getWixServerClient();
  const collection = await getCollectionBySlug(serverClient, slug);

  if (!collection) notFound();

  const banner = collection.media?.mainMedia?.image;

  return (
    <main className="max-w-7xl mx-auto space-y-8 px-4 py-8">
      <div className="flex flex-col gap-8">
        {banner && (
          <div className="relative hidden sm:block">
            <WixImage
              mediaIdentifier={banner.url}
              width={1280}
              height={400}
              alt={banner.altText}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
            <h1 className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-4xl lg:text-5xl font-bold">
              {collection.name}
            </h1>
          </div>
        )}
        <h1
          className={cn(
            "mx-auto text-3xl md:text-4xl font-bold",
            banner && "sm:hidden"
          )}
        >
          {collection.name}
        </h1>
      </div>
      {children}
    </main>
  );
};

const LoadingSkeleton = () => {
  return (
    <main className="max-w-7xl mx-auto space-y-8 px-4 py-8">
      <Skeleton className="w-48 h-10 mx-auto sm:block sm:aspect-[1280/400] sm:h-full sm:w-full" />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[26rem]" />
          ))}
        </div>
      </div>
    </main>
  );
};
