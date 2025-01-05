import { useState } from "react";
import { ProductGrid } from "./ProductGrid";
import { ProductDetailView } from "./ProductDetailView";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewLegalFooter } from "./PreviewLegalFooter";
import { PreviewPagination } from "./PreviewPagination";
import { ProductFilters } from "./ProductFilters";
import { ViewOptionsDropdown } from "./ViewOptionsDropdown";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";

interface PreviewContentProps {
  previewData: PreviewData;
  onReset?: () => void;
}

export function PreviewContent({ previewData, onReset }: PreviewContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [layout, setLayout] = useState("medium");
  const [textPlacement, setTextPlacement] = useState("below");
  const itemsPerPage = 12;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", previewData.id, currentPage],
    queryFn: async () => {
      console.log("Fetching products for page:", currentPage);
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("storefront_id", previewData.id)
        .eq("status", "active")
        .order("sort_order", { ascending: true })
        .range(start, end);

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log("Total count:", count);
      return data || [];
    },
  });

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
      className="min-h-screen"
      style={{ backgroundColor: previewData.storefront_background_color }}
    >
      <PreviewHeader previewData={previewData} onReset={onReset} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <ProductFilters />
          <ViewOptionsDropdown
            layout={layout}
            onLayoutChange={setLayout}
            textPlacement={textPlacement}
            onTextPlacementChange={setTextPlacement}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <ProductGrid
            products={products}
            layout={layout}
            textPlacement={textPlacement}
            onProductClick={setSelectedProduct}
            mainColor={previewData.main_color}
            fontColor={previewData.font_color}
            productCardBackgroundColor={previewData.product_card_background_color}
            productTitleTextColor={previewData.product_title_text_color}
            productDescriptionTextColor={previewData.product_description_text_color}
            productPriceColor={previewData.product_price_color}
            productCategoryBackgroundColor={previewData.product_category_background_color}
            productCategoryTextColor={previewData.product_category_text_color}
          />
        )}

        <PreviewPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={products.length}
        />
      </main>

      <PreviewLegalFooter />
    </div>
  );
}