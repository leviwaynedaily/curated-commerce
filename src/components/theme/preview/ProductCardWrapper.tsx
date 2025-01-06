import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ProductCard } from "./ProductCard";

interface ProductCardWrapperProps {
  product: any;
  productCardBackgroundColor: string;
  productTitleTextColor: string;
  productDescriptionTextColor: string;
  productPriceColor: string;
  productPriceButtonColor: string;
  productCategoryBackgroundColor: string;
  productCategoryTextColor: string;
  onProductClick: (product: any) => void;
  onVisibilityChange: (id: string, isVisible: boolean) => void;
}

export function ProductCardWrapper({
  product,
  productCardBackgroundColor,
  productTitleTextColor,
  productDescriptionTextColor,
  productPriceColor,
  productPriceButtonColor,
  productCategoryBackgroundColor,
  productCategoryTextColor,
  onProductClick,
  onVisibilityChange,
}: ProductCardWrapperProps) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  useEffect(() => {
    onVisibilityChange(product.id, inView);
  }, [inView, product.id, onVisibilityChange]);

  return (
    <div ref={ref}>
      <ProductCard
        product={product}
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
  );
}