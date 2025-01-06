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
    <span className="text-sm text-muted-foreground whitespace-nowrap">
      {isFetchingNextPage ? (
        <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
      ) : null}
      Showing {startIndex + 1}-{Math.min(endIndex + 1, currentCount)} of {totalCount} products
    </span>
  );
}