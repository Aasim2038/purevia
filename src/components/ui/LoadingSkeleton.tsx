export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg w-full h-64 mb-4"></div>
      <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
      <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductRailSkeleton() {
  return (
    <section className="py-14 md:py-18">
      <div className="mb-8">
        <div className="h-3 bg-gray-200 w-20 mb-2 rounded animate-pulse"></div>
        <div className="h-8 bg-gray-200 w-48 rounded animate-pulse"></div>
      </div>
      <div className="flex gap-5 snap-x snap-mandatory overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="min-w-[260px] sm:min-w-[300px] md:min-w-[320px] max-w-[320px] snap-start flex-shrink-0"
          >
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
