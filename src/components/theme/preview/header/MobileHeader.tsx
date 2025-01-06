import { PreviewData } from "@/types/preview";
import { ViewOptionsDropdown } from "../ViewOptionsDropdown";
import { HeaderDropdown } from "./HeaderDropdown";

interface MobileHeaderProps {
  previewData: PreviewData;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSortChange?: (sort: string) => void;
  onCategoryChange?: (category: string | null) => void;
  categories?: string[];
  selectedCategory?: string | null;
  currentSort?: string;
  textPlacement?: string;
  onTextPlacementChange?: (placement: string) => void;
  onLogoClick?: () => void;
  onShowInstructions?: () => void;
}

export function MobileHeader({
  previewData,
  onSortChange,
  onCategoryChange,
  categories = [],
  selectedCategory,
  currentSort,
  textPlacement = "below",
  onTextPlacementChange = () => {},
  onLogoClick,
  onShowInstructions,
}: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between md:hidden">
      <div className="flex items-center gap-2">
        {previewData.logo_url && (
          <img
            src={previewData.logo_url}
            alt={previewData.name}
            className="h-8 w-auto cursor-pointer"
            onClick={onLogoClick}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <ViewOptionsDropdown
          textPlacement={textPlacement}
          mainColor={previewData.main_color || "#000000"}
          onTextPlacementChange={onTextPlacementChange}
        />
        
        <HeaderDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          currentSort={currentSort}
          onSortChange={onSortChange}
          textPlacement={textPlacement}
          onTextPlacementChange={onTextPlacementChange}
          mainColor={previewData.main_color || "#000000"}
        />
      </div>
    </div>
  );
}