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
  onRestartVerification?: () => void;
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
  onLogoClick,
  textPlacement = "below",
  onTextPlacementChange = () => {},
  onShowInstructions,
  onRestartVerification,
}: PreviewHeaderProps) {
  console.log("PreviewHeader - header_opacity:", previewData.header_opacity);
  console.log("PreviewHeader - header_color:", previewData.header_color);
  console.log("PreviewHeader - searchQuery:", searchQuery);
  console.log("PreviewHeader - currentSort:", currentSort);

  const opacity = typeof previewData.header_opacity === 'number' ? previewData.header_opacity : 30;
  const headerColor = previewData.header_color || "#FFFFFF";
  const opacityHex = Math.round((opacity / 100) * 255).toString(16).padStart(2, '0');

  const handleLogoClick = () => {
    console.log("Logo clicked in PreviewHeader");
    if (onRestartVerification) {
      onRestartVerification();
    } else if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 w-full"
      style={{
        backgroundColor: `${headerColor}${opacityHex}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="w-full py-2 px-4 md:px-8">
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
          onLogoClick={handleLogoClick}
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
          onLogoClick={handleLogoClick}
          onShowInstructions={onShowInstructions}
        />
      </div>
    </header>
  );
}