import { Search, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeaderDropdown } from "./HeaderDropdown";
import { PreviewData } from "@/types/preview";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onShowInstructions?: () => void;
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
  onShowInstructions,
}: DesktopHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setShowSearch(true);
    }
  }, [searchQuery]);

  return (
    <TooltipProvider>
      <div className="hidden md:flex items-center w-full relative h-16">
        {/* Left side - Help Icon */}
        <div className="absolute left-0">
          {previewData.enable_instructions && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onShowInstructions}
                  className="bg-white/80 hover:bg-white/90"
                >
                  <HelpCircle className="h-4 w-4" style={{ color: previewData.main_color }} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Instructions</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        
        {/* Centered Logo */}
        <div className="flex-1 flex justify-center w-full">
          {previewData.logo_url && (
            <img 
              src={previewData.logo_url} 
              alt={previewData.name}
              className="h-12 object-contain cursor-pointer"
              onClick={onLogoClick}
            />
          )}
        </div>

        {/* Right Controls */}
        <div className="absolute right-0 flex items-center gap-2">
          {/* Search Icon/Input */}
          <div className="relative">
            {showSearch || searchQuery ? (
              <div className="absolute right-0 top-0 w-[200px] animate-slideDown">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm focus:ring-0 focus-visible:ring-1 focus-visible:ring-black/10 focus-visible:ring-offset-0"
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSearch(true)}
                    className="bg-white/80 hover:bg-white/90"
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
        </div>
      </div>
    </TooltipProvider>
  );
}
