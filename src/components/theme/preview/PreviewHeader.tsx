import { PreviewData } from "@/types/preview";
import { MobileHeader } from "./header/MobileHeader";
import { DesktopHeader } from "./header/DesktopHeader";

interface PreviewHeaderProps {
  previewData: PreviewData;
  onReset?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSortChange?: (sort: string) => void;
  onCategoryChange?: (category: string | null) => void;
  categories?: string[];
  selectedCategory?: string | null;
  currentSort?: string;
  isScrolled?: boolean;
  onLogoClick?: () => void;
  layout?: string;
  textPlacement?: string;
  onLayoutChange?: (layout: string) => void;
  onTextPlacementChange?: (placement: string) => void;
  onShowInstructions?: () => void;
}

export function PreviewHeader({
  previewData,
  searchQuery = "",
  onSearchChange = () => {},
  onSortChange,
  onCategoryChange,
  categories = [],
  selectedCategory,
  currentSort,
  isScrolled = false,
  onLogoClick,
  layout = "medium",
  textPlacement = "below",
  onLayoutChange = () => {},
  onTextPlacementChange = () => {},
  onShowInstructions,
}: PreviewHeaderProps) {
  return (
    <header 
      className={`sticky top-0 left-0 z-50 right-0 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/50 backdrop-blur-md shadow-sm' : 'bg-white/50 backdrop-blur-md'
      }`}
    >
      <div className="w-full py-4 px-4 md:px-8">
        <MobileHeader 
          previewData={previewData}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSortChange={onSortChange}
          onCategoryChange={onCategoryChange}
          categories={categories}
          selectedCategory={selectedCategory}
          currentSort={currentSort}
          layout={layout}
          onLayoutChange={onLayoutChange}
          textPlacement={textPlacement}
          onTextPlacementChange={onTextPlacementChange}
          onLogoClick={onLogoClick}
          onShowInstructions={onShowInstructions}
        />
        
        <DesktopHeader 
          previewData={previewData}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSortChange={onSortChange}
          onCategoryChange={onCategoryChange}
          categories={categories}
          selectedCategory={selectedCategory}
          currentSort={currentSort}
          layout={layout}
          onLayoutChange={onLayoutChange}
          onLogoClick={onLogoClick}
          onShowInstructions={onShowInstructions}
        />
      </div>
    </header>
  );
}