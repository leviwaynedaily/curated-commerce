import { PreviewData } from "@/types/preview";
import { HeaderDropdown } from "./HeaderDropdown";
import { FilterDropdown } from "./FilterDropdown";
import { Button } from "@/components/ui/button";
import { Search, CircleHelp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
  onLogoClick,
  onShowInstructions,
}: MobileHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex items-center justify-between md:hidden py-4">
      <div className="flex items-center gap-2">
        {previewData.logo_url && (
          <img
            src={previewData.logo_url}
            alt={previewData.name}
            className="h-10 w-auto cursor-pointer"
            onClick={onLogoClick}
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          {showSearch ? (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="w-[calc(100vw-120px)] pl-10 h-11 text-base rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
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
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
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
              className="hover:bg-opacity-20 h-11 w-11"
            >
              <Search className="h-6 w-6" />
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
            className="hover:bg-opacity-20 h-11 w-11"
          >
            <CircleHelp className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}