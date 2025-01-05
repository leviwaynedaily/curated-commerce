import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PreviewHeaderProps {
  colors: any;
  logo_url?: string;
  name: string;
  onGridChange: (size: 'small' | 'medium' | 'large') => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  onCategoryChange: (category: string | null) => void;
  searchQuery: string;
  gridSize: 'small' | 'medium' | 'large';
  categories: string[];
  selectedCategory: string | null;
  currentSort: string;
  onLogoClick: () => void;
}

export function PreviewHeader({ 
  colors, 
  logo_url, 
  name,
  onGridChange,
  onSearchChange,
  onSortChange,
  onCategoryChange,
  searchQuery,
  gridSize,
  categories,
  selectedCategory,
  currentSort,
  onLogoClick
}: PreviewHeaderProps) {
  return (
    <div 
      className="sticky top-0 z-50 py-4 transition-all duration-300"
      style={{ backgroundColor: `${colors.background.primary}CC` }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-4">
            {logo_url && (
              <img 
                src={logo_url} 
                alt={name} 
                className="h-8 object-contain cursor-pointer"
                onClick={onLogoClick}
              />
            )}
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
                style={{
                  backgroundColor: colors.background.secondary,
                  color: colors.font.primary,
                  borderColor: `${colors.font.secondary}33`
                }}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select
                value={currentSort}
                onValueChange={onSortChange}
              >
                <SelectTrigger 
                  className="w-[160px]"
                  style={{
                    backgroundColor: colors.background.secondary,
                    color: colors.font.primary,
                    borderColor: `${colors.font.secondary}33`
                  }}
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {categories.length > 0 && (
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={(value) => onCategoryChange(value === "all" ? null : value)}
                >
                  <SelectTrigger 
                    className="w-[160px]"
                    style={{
                      backgroundColor: colors.background.secondary,
                      color: colors.font.primary,
                      borderColor: `${colors.font.secondary}33`
                    }}
                  >
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

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onGridChange('small')}
                  className={gridSize === 'small' ? 'bg-accent' : ''}
                  style={{
                    backgroundColor: gridSize === 'small' ? colors.background.accent : 'transparent',
                    color: colors.font.primary
                  }}
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
                  className={gridSize === 'medium' ? 'bg-accent' : ''}
                  style={{
                    backgroundColor: gridSize === 'medium' ? colors.background.accent : 'transparent',
                    color: colors.font.primary
                  }}
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
                  className={gridSize === 'large' ? 'bg-accent' : ''}
                  style={{
                    backgroundColor: gridSize === 'large' ? colors.background.accent : 'transparent',
                    color: colors.font.primary
                  }}
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
      </div>
    </div>
  );
}