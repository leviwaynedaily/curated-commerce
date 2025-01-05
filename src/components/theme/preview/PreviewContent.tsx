import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PreviewData } from "@/types/preview";
import { Badge } from "@/components/ui/badge";
import { PreviewHeader } from "./PreviewHeader";

interface PreviewContentProps {
  previewData: PreviewData;
  colors: any;
}

export function PreviewContent({ previewData, colors }: PreviewContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["preview-products", previewData.id],
    queryFn: async () => {
      console.log("Fetching products for preview", previewData.id);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("storefront_id", previewData.id)
        .eq("status", "active")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log("Fetched products:", data);
      return data;
    },
    enabled: !!previewData.id,
  });

  // Handle scroll events
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 100);
    });
  }

  console.log("Current theme colors:", colors);
  console.log("Current preview data:", previewData);

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGridColumns = () => {
    switch (gridSize) {
      case 'small':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      case 'large':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default: // medium
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background.primary }}>
      <PreviewHeader
        colors={colors}
        logo_url={isScrolled ? previewData.logo_url : undefined}
        name={previewData.name}
        onGridChange={setGridSize}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        gridSize={gridSize}
      />

      <div className="container mx-auto px-4 py-8">
        {!isScrolled && (
          <div className="flex flex-col items-center mb-12">
            {previewData.logo_url && (
              <img 
                src={previewData.logo_url} 
                alt={previewData.name} 
                className="h-24 object-contain mb-8"
              />
            )}
            
            {previewData.show_description && previewData.description && (
              <p 
                className="mb-12 text-lg text-center max-w-2xl"
                style={{ color: colors.font.secondary }}
              >
                {previewData.description}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${getGridColumns()} gap-6`}>
          {filteredProducts?.map((product) => (
            <div 
              key={product.id}
              className="group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: colors.background.secondary }}
            >
              {product.images?.[0] && (
                <div className="aspect-square relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="flex gap-2 flex-wrap mb-2">
                  {product.category && (
                    <Badge
                      style={{
                        backgroundColor: colors.background.accent,
                        color: colors.font.primary
                      }}
                    >
                      {product.category}
                    </Badge>
                  )}
                </div>
                <h3 
                  className="font-semibold"
                  style={{ color: colors.font.primary }}
                >
                  {product.name}
                </h3>
                {product.description && (
                  <p 
                    className="text-sm line-clamp-2"
                    style={{ color: colors.font.secondary }}
                  >
                    {product.description}
                  </p>
                )}
                <div 
                  className="text-sm font-medium mt-2"
                  style={{ color: colors.font.highlight }}
                >
                  ${product.in_town_price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}