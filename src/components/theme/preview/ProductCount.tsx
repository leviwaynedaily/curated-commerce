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
    <div className="sticky top-[72px] z-10 py-2 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        {isFetchingNextPage ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null}
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex + 1, currentCount)} of {totalCount} products
        </span>
      </div>
    </div>
  );
}