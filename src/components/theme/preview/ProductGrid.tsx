import { useMemo } from "react";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: any[];
  layout: string;
  textPlacement: string;
  onProductClick: (product: any) => void;
  mainColor: string;
  fontColor: string;
  productCardBackgroundColor: string;
  productTitleTextColor: string;
  productDescriptionTextColor: string;
  productPriceColor: string;
  productPriceButtonColor: string;
  productCategoryBackgroundColor: string;
  productCategoryTextColor: string;
}

export function ProductGrid({ 
  products, 
  layout, 
  onProductClick,
  productCardBackgroundColor,
  productTitleTextColor,
  productDescriptionTextColor,
  productPriceColor,
  productPriceButtonColor,
  productCategoryBackgroundColor,
  productCategoryTextColor,
}: ProductGridProps) {
  // Memoize grid styles
  const gridStyles = useMemo(() => {
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
  }, [layout]);

  // Memoize the product cards to prevent unnecessary re-renders
  const productCards = useMemo(() => {
    return products?.map((product) => (
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
    ));
  }, [
    products,
    layout,
    productCardBackgroundColor,
    productTitleTextColor,
    productDescriptionTextColor,
    productPriceColor,
    productPriceButtonColor,
    productCategoryBackgroundColor,
    productCategoryTextColor,
    onProductClick
  ]);

  return (
    <div className="relative">
      <div className={`grid ${gridStyles} auto-rows-auto mt-1`}>
        {productCards}
      </div>
    </div>
  );
}