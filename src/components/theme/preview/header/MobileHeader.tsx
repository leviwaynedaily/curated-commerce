import { PreviewData } from "@/types/preview";
import { HeaderDropdown } from "./HeaderDropdown";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, Search, CircleHelp } from "lucide-react";
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
  onShowInstructions,
}: MobileHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex items-center justify-between md:hidden">
      <div className="flex items-center gap-2">
        {previewData.logo_url && (
          <img
            src={previewData.logo_url}
            alt={previewData.name}
            className="h-8 w-auto cursor-pointer"
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          {showSearch ? (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="w-32 pl-8 h-9 bg-white/80"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                onBlur={() => {
                  if (!searchQuery) {
                    setShowSearch(false);
                  }
                }}
              />
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
              className="bg-white/80 hover:bg-white/90"
            >
              <Search className="h-5 w-5" style={{ color: previewData.main_color }} />
            </Button>
          )}
        </div>

        <HeaderDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          currentSort={currentSort}
          onSortChange={onSortChange}
          mainColor={previewData.main_color}
        />

        {previewData.enable_instructions && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onShowInstructions}
            className="bg-white/80 hover:bg-white/90"
          >
            <CircleHelp className="h-5 w-5" style={{ color: previewData.main_color }} />
          </Button>
        )}
      </div>
    </div>
  );
}