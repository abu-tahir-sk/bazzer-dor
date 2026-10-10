export function ProductSkeleton() {
  return (
    <div className="flex min-w-0 flex-col justify-between gap-4 rounded-xl border border-bazaar-border bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-12 shrink-0 rounded-xl bg-gray-200"></div>
        <div className="min-w-0 flex-1">
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="flex items-end justify-between gap-2 border-t border-[#edf1ed] pt-3">
        <div className="flex min-w-0 flex-col gap-1 w-1/3">
          <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-1/4 rounded-full bg-gray-200"></div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
