import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  onLogoClick,
}: DesktopHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
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
  );
}