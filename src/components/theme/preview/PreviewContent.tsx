import { useState } from "react";
import { ProductGrid } from "./ProductGrid";
import { PreviewData } from "@/types/preview";
import { PreviewLegalFooter } from "./PreviewLegalFooter";
import { useSearchState } from "./hooks/useSearchState";
import { useStorefrontProducts, ITEMS_PER_PAGE } from "@/hooks/useStorefrontProducts";
import { PreviewInstructions } from "./PreviewInstructions";
import { PreviewHeader } from "./PreviewHeader";
import { ProductDetailView } from "./ProductDetailView";

interface PreviewContentProps {
  previewData: PreviewData;
  searchQuery?: string;
  selectedCategory?: string | null;
  currentSort?: string;
  textPlacement?: string;
  onReset?: () => void;
  onLogoClick?: () => void;
  showInstructions?: boolean;
  onCloseInstructions?: () => void;
  onShowInstructions?: () => void;
}

export function PreviewContent({ 
  previewData, 
  onReset, 
  onLogoClick,
  showInstructions = false,
  onCloseInstructions = () => {},
  onShowInstructions = () => {},
}: PreviewContentProps) {
  const [currentSort, setCurrentSort] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  const { searchQuery, handleSearchChange } = useSearchState();

  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading 
  } = useStorefrontProducts(previewData.id || '');

  const allProducts = data?.pages.flatMap(page => page.products) || [];
  
  console.log("PreviewContent - currentSort:", currentSort);
  console.log("PreviewContent - searchQuery:", searchQuery);
  
  // Apply filters and sorting
  const filteredAndSortedProducts = allProducts.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (currentSort) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "price-desc":
        return (b.in_town_price || 0) - (a.in_town_price || 0);
      case "price-asc":
        return (a.in_town_price || 0) - (b.in_town_price || 0);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleProductClick = (product: any) => {
    console.log("Product clicked, setting selected product:", product);
    setSelectedProduct(product);
  };

  // Calculate total count based on current page data and whether there are more pages
  const totalCount = hasNextPage 
    ? filteredAndSortedProducts.length + ITEMS_PER_PAGE 
    : filteredAndSortedProducts.length;

  // Get unique categories from products
  const categories = [...new Set(allProducts.map(product => product.category))].filter(Boolean) as string[];

  if (selectedProduct) {
    return (
      <ProductDetailView
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        previewData={previewData}
      />
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: previewData.storefront_background_color }}
    >
      <PreviewHeader
        previewData={previewData}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        onLogoClick={onLogoClick}
        onShowInstructions={onShowInstructions}
      />

      {showInstructions && (
        <PreviewInstructions 
          previewData={previewData} 
          onContinue={onCloseInstructions} 
        />
      )}

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
            products={filteredAndSortedProducts}
            layout="small"
            textPlacement="below"
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
            currentCount={filteredAndSortedProducts.length}
            totalCount={totalCount}
          />
        )}
      </main>

      <PreviewLegalFooter businessName={previewData.name} />
    </div>
  );
}