import { Search, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeaderDropdown } from "./HeaderDropdown";
import { PreviewData } from "@/types/preview";
import { ProductCount } from "../ProductCount";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MobileHeaderProps {
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
  onShowInstructions?: () => void;
  totalCount?: number;
  currentCount?: number;
  isFetchingNextPage?: boolean;
  startIndex?: number;
  endIndex?: number;
}

export function MobileHeader({
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
  onShowInstructions,
  totalCount = 0,
  currentCount = 0,
  isFetchingNextPage = false,
  startIndex = 0,
  endIndex = 0,
}: MobileHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setShowSearch(true);
    }
  }, [searchQuery]);

  return (
    <TooltipProvider>
      <div className="flex md:hidden items-center w-full relative h-12">
        {/* Left side - Logo */}
        <div className="flex items-center">
          {previewData.logo_url && (
            <img 
              src={previewData.logo_url} 
              alt={previewData.name}
              className="h-8 object-contain cursor-pointer"
              onClick={onLogoClick}
            />
          )}
        </div>

        {/* Right side - Search and Options */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search Icon/Input */}
          <div className="relative">
            {showSearch || searchQuery ? (
              <div className="absolute right-0 top-0 w-[200px] animate-slideDown">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-9 h-8 bg-white/80 focus:ring-0 focus-visible:ring-1 focus-visible:ring-black/10 focus-visible:ring-offset-0"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) {
                      setShowSearch(false);
                    }
                  }}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="bg-white/80 hover:bg-white/90 h-8 w-8"
                    onClick={() => setShowSearch(true)}
                  >
                    <Search className="h-4 w-4" style={{ color: previewData.main_color }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search Products</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Combined Options Dropdown with Tooltip */}
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

          {/* Help Icon */}
          {previewData.enable_instructions && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onShowInstructions}
                  className="bg-white/80 hover:bg-white/90 h-8 w-8"
                >
                  <HelpCircle className="h-4 w-4" style={{ color: previewData.main_color }} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Instructions</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Product Count */}
          <div className="ml-2">
            <ProductCount
              currentCount={currentCount}
              totalCount={totalCount}
              isFetchingNextPage={isFetchingNextPage}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}