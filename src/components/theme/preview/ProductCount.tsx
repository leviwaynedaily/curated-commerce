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
  // Calculate the display range
  const start = startIndex + 1; // Add 1 because we want to display 1-based indices
  const end = endIndex + 1; // Add 1 because endIndex is 0-based

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90 border shadow-sm">
        {isFetchingNextPage ? (
          <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
        ) : null}
        <span className="text-xs text-gray-700 whitespace-nowrap">
          {start} - {end} of {totalCount} products
        </span>
      </div>
    </div>
  );
}