import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <main className="max-w-7xl mx-auto space-y-8 px-4 py-8">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-20">
        <div className="basis-2/5">
          <Skeleton className="w-full aspect-square" />
        </div>
        <div className="basis-3/5 space-y-5">
          <Skeleton className="w-56 h-14" />
          <Skeleton className="w-full h-44" />
          <Skeleton className="w-56 h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>
    </main>
  );
};

export default Loading;
