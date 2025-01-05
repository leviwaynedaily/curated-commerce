import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { ProductDetailView } from "./ProductDetailView";
import { ProductGrid } from "./ProductGrid";
import { ProductFilters } from "./ProductFilters";
import { PreviewPagination } from "./PreviewPagination";

interface PreviewContentProps {
  previewData: any;
  onReset: () => void;
}

export function PreviewContent({ previewData, onReset }: PreviewContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('small');
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSort, setCurrentSort] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: productsData } = useStorefrontProducts(previewData.id, currentPage);
  const products = productsData?.products || [];

  useEffect(() => {
    const handleScroll = debounce(() => {
      const shouldBeScrolled = window.scrollY > 300;
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

  // Function to strip HTML tags from rich text
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (selectedProduct) {
    return (
      <ProductDetailView
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/80 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            {previewData.logo_url && (
              <img 
                src={previewData.logo_url} 
                alt={previewData.name} 
                className={`h-8 object-contain cursor-pointer transition-opacity duration-300 ${
                  isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onReset}
              />
            )}
            <div className={`flex-1 transition-opacity duration-300 ${
              isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <ProductFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                currentSort={currentSort}
                onSortChange={setCurrentSort}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
                gridSize={gridSize}
                onGridChange={setGridSize}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-16">
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
              style={{ color: 'inherit' }}
            >
              {stripHtml(previewData.description)}
            </p>
          )}
        </div>

        <div className={`mb-8 ${isScrolled ? 'hidden' : 'block'}`}>
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            gridSize={gridSize}
            onGridChange={setGridSize}
          />
        </div>

        <ProductGrid
          products={filteredAndSortedProducts}
          gridSize={gridSize}
          onProductClick={setSelectedProduct}
        />

        <PreviewPagination
          currentPage={currentPage}
          totalPages={productsData?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}