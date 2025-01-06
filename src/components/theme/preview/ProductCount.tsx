import { Loader2 } from "lucide-react";

interface ProductCountProps {
  currentCount: number;
  totalCount: number;
  isFetchingNextPage: boolean;
  startIndex: number;
  endIndex: number;
}

export function ProductCount({ 
  currentCount, 
  totalCount, 
  isFetchingNextPage,
  startIndex,
  endIndex
}: ProductCountProps) {
  return (
    <div className="absolute top-0 right-0 z-40 px-4 md:px-8">
      <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90 border shadow-sm">
        {isFetchingNextPage ? (
          <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
        ) : null}
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Showing {startIndex + 1}-{Math.min(endIndex + 1, currentCount)} of {totalCount} products
        </span>
      </div>
    </div>
  );
}