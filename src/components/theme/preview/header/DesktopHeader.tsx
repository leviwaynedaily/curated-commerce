import { PreviewData } from "@/types/preview";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CircleHelp } from "lucide-react";
import { HeaderDropdown } from "./HeaderDropdown";
import { FilterDropdown } from "./FilterDropdown";
import { useState } from "react";

interface DesktopHeaderProps {
  previewData: PreviewData;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSortChange?: (sort: string) => void;
  onCategoryChange?: (category: string | null) => void;
  categories?: string[];
  selectedCategory?: string | null;
  currentSort?: string;
  onLogoClick?: () => void;
  onShowInstructions?: () => void;
}

export function DesktopHeader({
  previewData,
  searchQuery = "",
  onSearchChange = () => {},
  onSortChange,
  onCategoryChange,
  categories = [],
  selectedCategory,
  currentSort,
  onLogoClick,
  onShowInstructions,
}: DesktopHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="hidden md:flex items-center justify-between">
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

      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          {showSearch ? (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-80 pl-10 h-9 rounded-full shadow-lg"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                onBlur={() => {
                  if (!searchQuery) {
                    setShowSearch(false);
                  }
                }}
                style={{
                  backgroundColor: `${previewData.main_color}10`,
                  borderColor: previewData.main_color,
                }}
              />
              <Search 
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: previewData.main_color }}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
              style={{ 
                backgroundColor: `${previewData.main_color}10`,
                color: previewData.main_color
              }}
              className="hover:bg-opacity-20"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>

        <FilterDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          mainColor={previewData.main_color}
        />

        <HeaderDropdown
          currentSort={currentSort}
          onSortChange={onSortChange}
          mainColor={previewData.main_color}
        />

        {previewData.enable_instructions && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onShowInstructions}
            style={{ 
              backgroundColor: `${previewData.main_color}10`,
              color: previewData.main_color
            }}
            className="hover:bg-opacity-20"
          >
            <CircleHelp className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}