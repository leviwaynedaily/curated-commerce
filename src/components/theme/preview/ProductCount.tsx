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
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50">
      <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 border shadow-sm">
        {isFetchingNextPage ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null}
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Showing {startIndex + 1}-{Math.min(endIndex + 1, currentCount)} of {totalCount} products
        </span>
      </div>
    </div>
  );
}