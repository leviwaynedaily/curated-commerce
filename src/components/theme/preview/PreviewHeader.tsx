import { Search, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PreviewData } from "@/types/preview";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <header 
      className={`sticky top-0 left-0 z-50 right-0 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/50 backdrop-blur-md shadow-sm' : 'bg-white/50 backdrop-blur-md'
      }`}
    >
      <div className="w-full py-4 px-4 md:px-8">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            {previewData.logo_url && (
              <img 
                src={previewData.logo_url} 
                alt={previewData.name}
                className="h-8 object-contain cursor-pointer"
                onClick={onLogoClick}
              />
            )}
          </div>

          {/* Search and Options */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {/* Search with dropdown trigger */}
            <div className="relative flex-1 max-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 h-9 bg-white/80"
              />
            </div>

            {/* Combined Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="bg-white/80 hover:bg-white/90 h-9 w-9"
                >
                  <Settings2 className="h-4 w-4" style={{ color: previewData.main_color }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm">
                {categories.length > 0 && (
                  <>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Category</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={selectedCategory || "all"} onValueChange={(value) => onCategoryChange?.(value === "all" ? null : value)}>
                      <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                      {categories.map((category) => (
                        <DropdownMenuRadioItem key={category} value={category}>
                          {category}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Sort By</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={currentSort} onValueChange={(value) => onSortChange?.(value)}>
                  <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-asc">Price: Low to High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-desc">Price: High to Low</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">View</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={layout} onValueChange={onLayoutChange}>
                  <DropdownMenuRadioItem value="list">List View</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="small">Small Grid</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="medium">Medium Grid</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="large">Large Grid</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Text Placement</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={textPlacement} onValueChange={onTextPlacementChange}>
                  <DropdownMenuRadioItem value="overlay">Text Overlay</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="below">Text Below</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-4">
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

          <div className="flex items-center gap-4 flex-grow justify-end">
            {categories.length > 0 && (
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => onCategoryChange?.(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[160px] bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select
              value={currentSort}
              onValueChange={onSortChange}
            >
              <SelectTrigger className="w-[160px] bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onLayoutChange('small')}
                className={layout === 'small' ? 'bg-accent' : ''}
              >
                <div className="w-4 h-4 grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-current rounded-sm" />
                  ))}
                </div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onLayoutChange('medium')}
                className={layout === 'medium' ? 'bg-accent' : ''}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-current rounded-sm" />
                  ))}
                </div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onLayoutChange('large')}
                className={layout === 'large' ? 'bg-accent' : ''}
              >
                <div className="w-4 h-4 grid grid-cols-1 gap-0.5">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-current rounded-sm" />
                  ))}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}