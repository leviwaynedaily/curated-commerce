import { useState } from "react";
import { ProductGrid } from "./ProductGrid";
import { PreviewData } from "@/types/preview";
import { PreviewLegalFooter } from "./PreviewLegalFooter";
import { useSearchState } from "./hooks/useSearchState";
import { useStorefrontProducts, ITEMS_PER_PAGE } from "@/hooks/useStorefrontProducts";

interface PreviewContentProps {
  previewData: PreviewData;
  onReset?: () => void;
  onLogoClick?: () => void;
}

export function PreviewContent({ previewData, onReset, onLogoClick }: PreviewContentProps) {
  const [textPlacement, setTextPlacement] = useState("below");
  const [currentSort, setCurrentSort] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { searchQuery, handleSearchChange } = useSearchState();

  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading 
  } = useStorefrontProducts(previewData.id || '');

  const allProducts = data?.pages.flatMap(page => page.products) || [];
  const filteredProducts = allProducts.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleProductClick = () => {
    // Placeholder for product click handler
    console.log("Product clicked");
  };

  // Calculate total count based on current page data and whether there are more pages
  const totalCount = hasNextPage 
    ? filteredProducts.length + ITEMS_PER_PAGE 
    : filteredProducts.length;

  return (
    <div 
      className="min-h-full flex flex-col"
      style={{ backgroundColor: previewData.storefront_background_color }}
    >
      <main className="container mx-auto px-4 pt-2 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            layout="small"
            textPlacement={textPlacement}
            onProductClick={handleProductClick}
            mainColor={previewData.main_color || "#000000"}
            fontColor={previewData.font_color || "#FFFFFF"}
            productCardBackgroundColor={previewData.product_card_background_color || "#FFFFFF"}
            productTitleTextColor={previewData.product_title_text_color || "#1A1F2C"}
            productDescriptionTextColor={previewData.product_description_text_color || "#8E9196"}
            productPriceColor={previewData.product_price_color || "#D946EF"}
            productPriceButtonColor={previewData.product_price_button_color || "#F1F0FB"}
            productCategoryBackgroundColor={previewData.product_category_background_color || "#E5E7EB"}
            productCategoryTextColor={previewData.product_category_text_color || "#1A1F2C"}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isDesktop={!window.matchMedia('(max-width: 768px)').matches}
            currentCount={filteredProducts.length}
            totalCount={totalCount}
          />
        )}
      </main>

      <PreviewLegalFooter businessName={previewData.name} />
    </div>
  );
}