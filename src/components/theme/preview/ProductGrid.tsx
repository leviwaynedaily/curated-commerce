import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { ProductCard } from "./ProductCard"
import { ProductCount } from "./ProductCount"

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
}

export function ProductGrid({ 
  products, 
  layout, 
  textPlacement,
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
  isDesktop = false
}: ProductGridProps) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 11 });
  
  const { ref: infiniteScrollRef, inView } = useInView({
    threshold: 0.5,
    skip: !hasNextPage || isFetchingNextPage || isDesktop,
  });

  const { ref: visibilityRef, inView: isVisible } = useInView({
    threshold: 0.1,
    trackVisibility: true,
    delay: 100
  });

  useEffect(() => {
    if (inView && hasNextPage && !isDesktop) {
      console.log("Infinite scroll trigger reached, loading more products");
      fetchNextPage?.();
    }
  }, [inView, hasNextPage, fetchNextPage, isDesktop]);

  const getGridStyles = () => {
    switch (layout) {
      case 'small':
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'
      case 'large':
        return 'grid-cols-1 md:grid-cols-2 gap-4'
      case 'list':
        return 'grid-cols-1 gap-4'
      default: // medium
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    }
  }

  useEffect(() => {
    if (isVisible) {
      const visibleProducts = products.length;
      setVisibleRange({
        start: 0,
        end: Math.min(visibleProducts - 1, 11)
      });
    }
  }, [isVisible, products.length]);

  return (
    <div className="relative">
      <ProductCount 
        currentCount={products.length}
        totalCount={products.length + (hasNextPage ? 25 : 0)}
        isFetchingNextPage={isFetchingNextPage || false}
        startIndex={visibleRange.start}
        endIndex={visibleRange.end}
      />

      <div 
        ref={visibilityRef}
        className={`grid ${getGridStyles()} auto-rows-auto mt-1`}
      >
        {products?.map((product, index) => (
          <div key={product.id}>
            <ProductCard
              product={product}
              layout={layout}
              productCardBackgroundColor={productCardBackgroundColor}
              productTitleTextColor={productTitleTextColor}
              productDescriptionTextColor={productDescriptionTextColor}
              productPriceColor={productPriceColor}
              productPriceButtonColor={productPriceButtonColor}
              productCategoryBackgroundColor={productCategoryBackgroundColor}
              productCategoryTextColor={productCategoryTextColor}
              onProductClick={onProductClick}
            />
          </div>
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