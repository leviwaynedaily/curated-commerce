import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { ProductCount } from "./ProductCount"
import { ProductCardWrapper } from "./ProductCardWrapper"

interface ProductGridProps {
  products: any[]
  layout: string
  textPlacement: string
  onProductClick: (product: any) => void
  mainColor: string
  fontColor: string
  productCardBackgroundColor: string
  productTitleTextColor: string
  productDescriptionTextColor: string
  productPriceColor: string
  productPriceButtonColor: string
  productCategoryBackgroundColor: string
  productCategoryTextColor: string
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
  isDesktop?: boolean
  currentCount: number
  totalCount: number
}

export function ProductGrid({ 
  products,
  onProductClick,
  productCardBackgroundColor,
  productTitleTextColor,
  productDescriptionTextColor,
  productPriceColor,
  productPriceButtonColor,
  productCategoryBackgroundColor,
  productCategoryTextColor,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isDesktop = false,
  currentCount,
  totalCount
}: ProductGridProps) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 11 });
  const [visibleProducts, setVisibleProducts] = useState<Set<string>>(new Set());
  
  // Update visible range when products change
  useEffect(() => {
    if (products.length > 0) {
      setVisibleRange({
        start: 0,
        end: Math.min(products.length - 1, totalCount - 1)
      });
    }
  }, [products.length, totalCount]);

  const { ref: infiniteScrollRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
    skip: !hasNextPage || isFetchingNextPage || isDesktop,
  });

  const handleScroll = useCallback(() => {
    if (inView && hasNextPage && !isDesktop && !isFetchingNextPage) {
      console.log("Infinite scroll trigger reached, loading more products");
      fetchNextPage?.();
    }
  }, [inView, hasNextPage, isDesktop, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  const handleVisibilityChange = useCallback((productId: string, isVisible: boolean) => {
    setVisibleProducts(prev => {
      const newSet = new Set(prev);
      if (isVisible) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="relative">
      <ProductCount 
        currentCount={visibleProducts.size}
        totalCount={totalCount}
        isFetchingNextPage={isFetchingNextPage || false}
        startIndex={visibleRange.start}
        endIndex={Math.min(visibleRange.end, currentCount - 1)}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-1">
        {products?.map((product) => (
          <ProductCardWrapper
            key={product.id}
            product={product}
            productCardBackgroundColor={productCardBackgroundColor}
            productTitleTextColor={productTitleTextColor}
            productDescriptionTextColor={productDescriptionTextColor}
            productPriceColor={productPriceColor}
            productPriceButtonColor={productPriceButtonColor}
            productCategoryBackgroundColor={productCategoryBackgroundColor}
            productCategoryTextColor={productCategoryTextColor}
            onProductClick={onProductClick}
            onVisibilityChange={handleVisibilityChange}
          />
        ))}
      </div>

      {!isDesktop && hasNextPage && (
        <div ref={infiniteScrollRef} className="h-20 flex items-center justify-center">
          {isFetchingNextPage && (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          )}
        </div>
      )}

      {isDesktop && hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => fetchNextPage?.()}
            disabled={isFetchingNextPage}
            className="min-w-[200px]"
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isFetchingNextPage ? "Loading..." : "Load More Products"}
          </Button>
        </div>
      )}
    </div>
  );
}