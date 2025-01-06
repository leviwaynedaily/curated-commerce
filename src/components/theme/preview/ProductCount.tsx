import { Loader2 } from "lucide-react";

interface ProductCountProps {
  currentCount: number;
  totalCount: number;
  isFetchingNextPage: boolean;
}

export function ProductCount({ currentCount, totalCount, isFetchingNextPage }: ProductCountProps) {
  return (
    <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
      {isFetchingNextPage ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : null}
      <span>
        Showing {currentCount} of {totalCount} products
      </span>
    </div>
  );
}