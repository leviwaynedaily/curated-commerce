import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { ProductDetailView } from "./ProductDetailView";
import { ProductGrid } from "./ProductGrid";
import { PreviewPagination } from "./PreviewPagination";
import { PreviewHeader } from "./PreviewHeader";

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
      const container = document.querySelector('.preview-container');
      if (!container) return;
      
      const headerElement = document.querySelector('.sticky-header');
      if (!headerElement) return;

      const headerRect = headerElement.getBoundingClientRect();
      const scrollPosition = container.scrollTop;
      console.log('Current scroll position:', scrollPosition);
      
      if (headerRect.top <= 0) {
        if (!isScrolled) {
          console.log('Showing header - scroll position:', scrollPosition);
          setIsScrolled(true);
        }
      } else {
        if (isScrolled) {
          console.log('Hiding header - scroll position:', scrollPosition);
          setIsScrolled(false);
        }
      }
    }, 10);

    const container = document.querySelector('.preview-container');
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      console.log('Scroll listener added to preview container');
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isScrolled]);

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

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleLogoClick = () => {
    console.log("Logo clicked, resetting verification");
    onReset();
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
    <div className="preview-container h-screen overflow-y-auto bg-background">
      {/* Static Logo Section */}
      <div className="w-full bg-background py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            {previewData.logo_url && (
              <img 
                src={previewData.logo_url} 
                alt={previewData.name} 
                className="h-24 object-contain cursor-pointer"
                onClick={handleLogoClick}
              />
            )}
            
            {previewData.show_description && previewData.description && (
              <p className="text-lg text-center max-w-2xl">
                {stripHtml(previewData.description)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Header Section - Initially not sticky */}
      <div 
        className={`sticky-header bg-background transition-all duration-300 ${
          isScrolled ? 'sticky top-0 z-50 shadow-md' : ''
        }`}
      >
        <PreviewHeader
          logo_url={previewData.logo_url}
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
          isScrolled={isScrolled}
          onLogoClick={handleLogoClick}
        />
      </div>

      {/* Main Content - Reduced top padding */}
      <div className="container mx-auto px-4 pt-2 pb-8">
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