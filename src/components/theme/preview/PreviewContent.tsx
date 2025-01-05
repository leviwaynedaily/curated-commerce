import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { ProductDetailView } from "./ProductDetailView";
import { ProductGrid } from "./ProductGrid";
import { ProductFilters } from "./ProductFilters";
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

  // Properly set up scroll event listener
  useEffect(() => {
    const handleScroll = debounce(() => {
      const shouldBeScrolled = window.scrollY > 300;
      setIsScrolled(shouldBeScrolled);
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <div className="min-h-screen flex flex-col bg-background">
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
              onClick={handleLogoClick}
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