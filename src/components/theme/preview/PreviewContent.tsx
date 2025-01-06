import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "./ProductGrid";
import { ProductDetailView } from "./ProductDetailView";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewLegalFooter } from "./PreviewLegalFooter";
import { PreviewPagination } from "./PreviewPagination";
import { ViewOptionsDropdown } from "./ViewOptionsDropdown";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { Button } from "@/components/ui/button";

interface PreviewContentProps {
  previewData: PreviewData;
  onReset?: () => void;
  onLogoClick?: () => void;
}

export function PreviewContent({ previewData, onReset, onLogoClick }: PreviewContentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [layout, setLayout] = useState("small");
  const [textPlacement, setTextPlacement] = useState("below");
  const [currentSort, setCurrentSort] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 12;

  // Get search query from URL params
  const searchQuery = searchParams.get("search") || "";

  // Update search query in URL
  const handleSearchChange = (query: string) => {
    if (query) {
      searchParams.set("search", query);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle back navigation from product detail
  const handleBackFromProduct = () => {
    setSelectedProduct(null);
    // Search params are preserved automatically by React Router
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowInstructions(false);
      }
    };

    if (showInstructions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInstructions]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", previewData.id, currentPage, searchQuery, currentSort, selectedCategory],
    queryFn: async () => {
      console.log("Fetching products for page:", currentPage);
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("storefront_id", previewData.id)
        .eq("status", "active")
        .range(start, end);

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      switch (currentSort) {
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "price-asc":
          query = query.order("in_town_price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("in_town_price", { ascending: false });
          break;
        default: // newest
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      return data || [];
    },
  });

  if (selectedProduct) {
    return (
      <ProductDetailView
        product={selectedProduct}
        onBack={handleBackFromProduct}
        previewData={previewData}
      />
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: previewData.storefront_background_color }}
    >
      <PreviewHeader 
        previewData={previewData}
        onReset={onReset}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSortChange={setCurrentSort}
        onCategoryChange={setSelectedCategory}
        categories={Array.from(new Set(products.map(p => p.category).filter(Boolean)))}
        selectedCategory={selectedCategory}
        currentSort={currentSort}
        isScrolled={isScrolled}
        layout={layout}
        textPlacement={textPlacement}
        onLayoutChange={setLayout}
        onTextPlacementChange={setTextPlacement}
        onLogoClick={onLogoClick}
        onShowInstructions={() => setShowInstructions(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
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
        )}

        <PreviewPagination
          currentPage={currentPage}
          totalPages={Math.ceil(products.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </main>

      <PreviewLegalFooter />

      {showInstructions && previewData.enable_instructions && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="h-full w-full flex items-center justify-center p-4">
            <div ref={modalRef} className="w-[400px] rounded-lg shadow-xl bg-white p-6 space-y-6">
              {previewData.logo_url && (
                <img 
                  src={previewData.logo_url} 
                  alt={previewData.name} 
                  className="h-16 mx-auto object-contain"
                />
              )}
              
              <h2 className="text-xl font-semibold text-center">
                Welcome to {previewData.name}
              </h2>
              
              <div 
                className="prose prose-sm max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-inherit space-y-4"
                dangerouslySetInnerHTML={{ __html: previewData.instructions_text || '' }}
              />

              <Button
                className="w-full"
                onClick={() => setShowInstructions(false)}
                style={{ 
                  backgroundColor: previewData.verification_button_color,
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}