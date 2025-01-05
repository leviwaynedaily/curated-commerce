import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewOptionsDropdown } from "./ViewOptionsDropdown"
import { PreviewData } from "@/types/preview"

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

          {/* Combined Filters Row */}
          <div className="grid grid-cols-2 gap-2">
            {categories.length > 0 && (
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => onCategoryChange?.(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full h-12 bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="All Categories" />
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
              onValueChange={(value) => onSortChange?.(value)}
            >
              <SelectTrigger className="w-full h-12 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          {/* View Options */}
          <div className="flex justify-end">
            <ViewOptionsDropdown
              layout={layout}
              textPlacement={textPlacement}
              mainColor={previewData.main_color || "#000000"}
              onLayoutChange={onLayoutChange}
              onTextPlacementChange={onTextPlacementChange}
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
              onValueChange={(value) => onSortChange?.(value)}
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

            <ViewOptionsDropdown
              layout={layout}
              textPlacement={textPlacement}
              mainColor={previewData.main_color || "#000000"}
              onLayoutChange={onLayoutChange}
              onTextPlacementChange={onTextPlacementChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
}