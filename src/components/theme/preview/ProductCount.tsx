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
    <div className="sticky top-[72px] z-10 flex justify-end px-4">
      <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-sm">
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