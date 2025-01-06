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
  isFetchingNextPage,
  isDesktop = false,
  currentCount,
  totalCount
}: ProductGridProps) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 11 });
  const [visibleProducts, setVisibleProducts] = useState<Set<string>>(new Set());
  
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
    </div>
  );
}