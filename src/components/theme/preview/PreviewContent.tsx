import { useState, useEffect } from "react";
import { PreviewHeader } from "./PreviewHeader";
import debounce from "lodash.debounce";
import { Badge } from "@/components/ui/badge";
import { PreviewPagination } from "./PreviewPagination";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";

interface PreviewContentProps {
  previewData: any;
  colors: any;
  onReset: () => void;
}

export function PreviewContent({ previewData, colors, onReset }: PreviewContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('small');
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSort, setCurrentSort] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: productsData } = useStorefrontProducts(previewData.id, currentPage);
  const products = productsData?.products || [];

  useEffect(() => {
    const handleScroll = debounce(() => {
      const shouldBeScrolled = window.scrollY > 50;
      if (isScrolled !== shouldBeScrolled) {
        setIsScrolled(shouldBeScrolled);
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, currentSort]);

  const categories = products 
    ? [...new Set(products.map(product => product.category).filter(Boolean))]
    : [];

  const filteredAndSortedProducts = products
    ?.filter(product =>
      (searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (!selectedCategory || product.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (currentSort) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price-asc':
          return (a.in_town_price || 0) - (b.in_town_price || 0);
        case 'price-desc':
          return (b.in_town_price || 0) - (a.in_town_price || 0);
        default:
          return 0;
      }
    });

  const getGridColumns = () => {
    switch (gridSize) {
      case 'small':
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
      case 'large':
        return 'grid-cols-1';
      default: // medium
        return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  const getCardSize = () => {
    switch (gridSize) {
      case 'small':
        return 'aspect-[3/4]';
      case 'large':
        return 'aspect-square max-w-3xl mx-auto';
      default: // medium
        return 'aspect-[4/5]';
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
        onSortChange={setCurrentSort}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        gridSize={gridSize}
        categories={categories}
        selectedCategory={selectedCategory}
        currentSort={currentSort}
        onLogoClick={onReset}
      />

      <div className="container mx-auto px-4">
        <div 
          className={`flex flex-col items-center mb-8 transition-all duration-500 ease-in-out ${
            isScrolled ? 'opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden' : 'opacity-100 translate-y-0'
          }`}
        >
          {previewData.logo_url && (
            <img 
              src={previewData.logo_url} 
              alt={previewData.name} 
              className="h-24 object-contain mb-4 cursor-pointer"
              onClick={onReset}
            />
          )}
          
          {previewData.show_description && previewData.description && (
            <p 
              className="text-lg text-center max-w-2xl mb-8"
              style={{ color: colors.font.secondary }}
            >
              {previewData.description}
            </p>
          )}
        </div>

        <div className={`grid ${getGridColumns()} gap-4`}>
          {filteredAndSortedProducts?.map((product) => (
            <div 
              key={product.id}
              className={`group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${getCardSize()}`}
              style={{ backgroundColor: colors.background.secondary }}
            >
              {product.images?.[0] && (
                <div className="relative h-full">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
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
                    <h3 className="font-semibold text-white mb-1">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-white/80 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="text-sm font-medium mt-2 text-white">
                      ${product.in_town_price}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <PreviewPagination
          currentPage={currentPage}
          totalPages={productsData?.totalPages || 1}
          onPageChange={setCurrentPage}
          colors={colors}
        />
      </div>
    </div>
  );
}