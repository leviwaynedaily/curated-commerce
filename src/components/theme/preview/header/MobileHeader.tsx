import { PreviewData } from "@/types/preview";
import { HeaderDropdown } from "./HeaderDropdown";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, Info, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  searchQuery = "",
  onSearchChange = () => {},
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
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-32 pl-8 h-9 bg-white/80"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

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

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSortChange?.(currentSort === 'newest' ? 'oldest' : 'newest')}
          className="bg-white/80 hover:bg-white/90"
        >
          <ArrowDownUp className="h-5 w-5" style={{ color: previewData.main_color }} />
        </Button>

        {previewData.enable_instructions && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onShowInstructions}
            className="bg-white/80 hover:bg-white/90"
          >
            <Info className="h-5 w-5" style={{ color: previewData.main_color }} />
          </Button>
        )}
      </div>
    </div>
  );
}