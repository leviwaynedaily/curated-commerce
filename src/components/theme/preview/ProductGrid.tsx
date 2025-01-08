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
  currentCount,
  totalCount
}: ProductGridProps) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 11 });
  const [visibleProducts, setVisibleProducts] = useState<Set<string>>(new Set());
  
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("Loading more products...");
      fetchNextPage?.();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (products.length > 0) {
      setVisibleRange({
        start: 0,
        end: Math.min(products.length - 1, totalCount - 1)
      });
    }
  }, [products.length, totalCount]);

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
    <div className="relative pt-20">
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

      {/* Loading indicator */}
      <div 
        ref={ref} 
        className={`w-full flex justify-center py-8 transition-opacity duration-300 ${isFetchingNextPage ? 'opacity-100' : 'opacity-0'}`}
      >
        {isFetchingNextPage && (
          <div className="flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-gray-600">Loading more products...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}