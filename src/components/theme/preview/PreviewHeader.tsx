import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PreviewHeaderProps {
  logo_url?: string;
  name: string;
  onGridChange: (size: 'small' | 'medium' | 'large') => void;
  onSearchChange: (query: string) => void;
  onSortChange?: (sort: string) => void;
  onCategoryChange?: (category: string | null) => void;
  searchQuery: string;
  gridSize: 'small' | 'medium' | 'large';
  categories?: string[];
  selectedCategory?: string | null;
  currentSort?: string;
  isScrolled: boolean;
  onLogoClick?: () => void;
}

export function PreviewHeader({ 
  logo_url, 
  name,
  onGridChange,
  onSearchChange,
  onSortChange,
  onCategoryChange,
  searchQuery,
  gridSize,
  categories = [],
  selectedCategory,
  currentSort,
  isScrolled,
  onLogoClick
}: PreviewHeaderProps) {
  return (
    <header 
      className={`w-full transition-all duration-300 ${
        isScrolled 
          ? 'fixed top-0 left-0 z-50 right-0 bg-white/80 backdrop-blur-sm shadow-sm transform translate-y-0' 
          : 'relative bg-transparent transform -translate-y-full pointer-events-none opacity-0'
      }`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between py-4 px-4 md:px-8">
          <div className="flex items-center space-x-4 min-w-[120px]">
            {logo_url && (
              <img 
                src={logo_url} 
                alt={name}
                className="h-8 object-contain cursor-pointer"
                onClick={onLogoClick}
              />
            )}
          </div>
        </div>

        <div className="border-t border-gray-200/30">
          <div className="flex flex-col md:flex-row items-center justify-between py-2 px-4 md:px-8 gap-4">
            <div className="flex items-center space-x-4 overflow-x-auto w-full md:w-auto">
              {categories.length > 0 && (
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={(value) => onCategoryChange?.(value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-[160px] bg-white/80">
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
                <SelectTrigger className="w-[160px] bg-white/80">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onGridChange('small')}
                className={`${gridSize === 'small' ? 'bg-accent' : 'bg-white/80'}`}
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
                onClick={() => onGridChange('medium')}
                className={`${gridSize === 'medium' ? 'bg-accent' : 'bg-white/80'}`}
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
                onClick={() => onGridChange('large')}
                className={`${gridSize === 'large' ? 'bg-accent' : 'bg-white/80'}`}
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