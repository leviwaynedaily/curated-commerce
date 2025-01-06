import { PreviewData } from "@/types/preview";
import { MobileHeader } from "./header/MobileHeader";
import { DesktopHeader } from "./header/DesktopHeader";

interface PreviewHeaderProps {
  previewData: PreviewData;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSortChange?: (sort: string) => void;
  onCategoryChange?: (category: string | null) => void;
  categories?: string[];
  selectedCategory?: string | null;
  currentSort?: string;
  isScrolled?: boolean;
  onLogoClick?: () => void;
  textPlacement?: string;
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
  textPlacement = "below",
  onTextPlacementChange = () => {},
  onShowInstructions,
}: PreviewHeaderProps) {
  console.log("PreviewHeader - searchQuery:", searchQuery);
  console.log("PreviewHeader - currentSort:", currentSort);

  return (
    <header 
      className="sticky top-0 left-0 z-50 right-0 w-full transition-all duration-300"
      style={{
        backgroundColor: `${previewData.storefront_background_color}10`,
      }}
    >
      <div className="w-full py-2 px-4 md:px-8 backdrop-blur-md bg-white/40">
        <MobileHeader 
          previewData={previewData}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSortChange={onSortChange}
          onCategoryChange={onCategoryChange}
          categories={categories}
          selectedCategory={selectedCategory}
          currentSort={currentSort}
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
          onLogoClick={onLogoClick}
          onShowInstructions={onShowInstructions}
        />
      </div>
    </header>
  );
}