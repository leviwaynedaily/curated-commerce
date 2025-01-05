import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeaderDropdown } from "./HeaderDropdown";
import { PreviewData } from "@/types/preview";

interface DesktopHeaderProps {
  previewData: PreviewData;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSortChange?: (sort: string) => void;
  onCategoryChange?: (category: string | null) => void;
  categories?: string[];
  selectedCategory?: string | null;
  currentSort?: string;
  layout?: string;
  onLayoutChange?: (layout: string) => void;
  textPlacement?: string;
  onTextPlacementChange?: (placement: string) => void;
  onLogoClick?: () => void;
}

export function DesktopHeader({
  previewData,
  searchQuery,
  onSearchChange,
  onSortChange,
  onCategoryChange,
  categories = [],
  selectedCategory,
  currentSort,
  layout = "medium",
  onLayoutChange,
  textPlacement = "below",
  onTextPlacementChange,
  onLogoClick,
}: DesktopHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="hidden md:flex items-center justify-between gap-4">
      {/* Left spacer */}
      <div className="w-20" />
      
      {/* Centered Logo */}
      <div className="flex-1 flex justify-center">
        {previewData.logo_url && (
          <img 
            src={previewData.logo_url} 
            alt={previewData.name}
            className="h-16 object-contain cursor-pointer" // Increased from h-12 to h-16
            onClick={onLogoClick}
          />
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 w-20 justify-end">
        {/* Search Icon/Input */}
        <div className="relative">
          {showSearch ? (
            <div className="absolute right-0 top-0 w-[200px] animate-slideDown">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm"
                autoFocus
                onBlur={() => {
                  if (!searchQuery) {
                    setShowSearch(false);
                  }
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
              className="bg-white/80 hover:bg-white/90"
            >
              <Search className="h-4 w-4" style={{ color: previewData.main_color }} />
            </Button>
          )}
        </div>

        {/* Combined Options Dropdown */}
        <HeaderDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          currentSort={currentSort}
          onSortChange={onSortChange}
          layout={layout}
          onLayoutChange={onLayoutChange}
          textPlacement={textPlacement}
          onTextPlacementChange={onTextPlacementChange}
          mainColor={previewData.main_color}
        />
      </div>
    </div>
  );
}