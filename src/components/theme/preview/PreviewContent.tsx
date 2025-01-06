import { useState, useRef } from "react";
import { ProductGrid } from "./ProductGrid";
import { PreviewLegalFooter } from "./PreviewLegalFooter";
import { PreviewData } from "@/types/preview";
import { InstructionsModal } from "./modals/InstructionsModal";
import { useSearchState } from "./hooks/useSearchState";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { ProductFilters } from "./ProductFilters";
import { PreviewPagination } from "./PreviewPagination";

interface PreviewContentProps {
  previewData: PreviewData;
  onReset?: () => void;
  onLogoClick?: () => void;
}

export function PreviewContent({ previewData, onReset, onLogoClick }: PreviewContentProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [layout, setLayout] = useState("small");
  const [currentPage, setCurrentPage] = useState(1);
  const [showInstructions, setShowInstructions] = useState(false);
  const { searchQuery, handleSearchChange } = useSearchState();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSort, setCurrentSort] = useState("newest");
  const modalRef = useRef<HTMLDivElement>(null);

  const { 
    data,
    isLoading 
  } = useStorefrontProducts(previewData.id || '');

  // Get products from the data directly since it's not paginated anymore
  const allProducts = data?.products || [];
  
  // Filter products based on search and category
  const filteredProducts = allProducts.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  // Calculate pagination
  const ITEMS_PER_PAGE = 25;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div 
      className="min-h-full flex flex-col"
      style={{ backgroundColor: previewData.storefront_background_color }}
    >
      <main className="container mx-auto px-4 pt-2 flex-1">
        <div className="mb-6">
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)))}
            gridSize={layout as any}
            onGridChange={setLayout as any}
          />
        </div>

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
          <>
            <ProductGrid
              products={paginatedProducts}
              layout={layout}
              textPlacement="below"
              onProductClick={setSelectedProduct}
              mainColor={previewData.main_color || "#000000"}
              fontColor={previewData.font_color || "#FFFFFF"}
              productCardBackgroundColor={previewData.product_card_background_color || "#FFFFFF"}
              productTitleTextColor={previewData.product_title_text_color || "#1A1F2C"}
              productDescriptionTextColor={previewData.product_description_text_color || "#8E9196"}
              productPriceColor={previewData.product_price_color || "#D946EF"}
              productPriceButtonColor={previewData.product_price_button_color || "#F1F0FB"}
              productCategoryBackgroundColor={previewData.product_category_background_color || "#E5E7EB"}
              productCategoryTextColor={previewData.product_category_text_color || "#1A1F2C"}
            />

            <div className="mt-8 mb-4">
              <PreviewPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </main>

      <PreviewLegalFooter />

      {showInstructions && previewData.enable_instructions && (
        <InstructionsModal
          previewData={previewData}
          onClose={() => setShowInstructions(false)}
          modalRef={modalRef}
        />
      )}
    </div>
  );
}