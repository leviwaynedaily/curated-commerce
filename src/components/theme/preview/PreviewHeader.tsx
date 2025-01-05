import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PreviewData } from "@/types/preview"
import { MobileHeaderIcons } from "./MobileHeaderIcons"
import { DesktopHeaderControls } from "./DesktopHeaderControls"

interface PreviewHeaderProps {
  previewData: PreviewData;
  onReset?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSortChange?: (sort: string) => void;
  onCategoryChange?: (category: string | null) => void;
  categories?: string[];
  selectedCategory?: string | null;
  currentSort?: string;
  isScrolled?: boolean;
  onLogoClick?: () => void;
  layout?: string;
  textPlacement?: string;
  onLayoutChange?: (layout: string) => void;
  onTextPlacementChange?: (placement: string) => void;
}

export function PreviewHeader({
  previewData,
  onReset,
  searchQuery = "",
  onSearchChange = () => {},
  onSortChange,
  onCategoryChange,
  categories = [],
  selectedCategory,
  currentSort,
  isScrolled = false,
  onLogoClick,
  layout = "medium",
  textPlacement = "below",
  onLayoutChange = () => {},
  onTextPlacementChange = () => {},
}: PreviewHeaderProps) {
  return (
    <header 
      className={`sticky top-0 left-0 z-50 right-0 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/50 backdrop-blur-md shadow-sm' : 'bg-white/50 backdrop-blur-md'
      }`}
    >
      <div className="w-full py-4 px-4 md:px-8">
        {/* Mobile Layout */}
        <div className="flex flex-col space-y-4 md:hidden">
          {/* Logo Row */}
          <div className="flex justify-center">
            {previewData.logo_url && (
              <img 
                src={previewData.logo_url} 
                alt={previewData.name}
                className="h-12 object-contain cursor-pointer"
                onClick={onLogoClick}
              />
            )}
          </div>

          {/* Icons Row */}
          <MobileHeaderIcons
            categories={categories}
            selectedCategory={selectedCategory || null}
            onCategoryChange={onCategoryChange || (() => {})}
            currentSort={currentSort}
            onSortChange={onSortChange}
            layout={layout}
            textPlacement={textPlacement}
            onLayoutChange={onLayoutChange}
            onTextPlacementChange={onTextPlacementChange}
            previewData={previewData}
          />

          {/* Search Row */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm h-12 w-full"
            />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            {previewData.logo_url && (
              <img 
                src={previewData.logo_url} 
                alt={previewData.name}
                className="h-12 object-contain cursor-pointer"
                onClick={onLogoClick}
              />
            )}
          </div>

          <DesktopHeaderControls
            categories={categories}
            selectedCategory={selectedCategory || null}
            onCategoryChange={onCategoryChange || (() => {})}
            currentSort={currentSort}
            onSortChange={onSortChange}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            layout={layout}
            textPlacement={textPlacement}
            onLayoutChange={onLayoutChange}
            onTextPlacementChange={onTextPlacementChange}
            previewData={previewData}
          />
        </div>
      </div>
    </header>
  );
}