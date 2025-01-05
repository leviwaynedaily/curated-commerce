import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Grid2X2, Grid3X3, LayoutGrid } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";

interface PreviewHeaderProps {
  colors: any;
  logo_url?: string;
  name?: string;
  onGridChange: (size: 'small' | 'medium' | 'large') => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  onCategoryChange: (category: string | null) => void;
  searchQuery: string;
  gridSize: 'small' | 'medium' | 'large';
  categories: string[];
  selectedCategory: string | null;
  currentSort: string;
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
}: PreviewHeaderProps) {
  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-lg transition-all duration-500 ease-in-out"
      style={{ 
        backgroundColor: `${colors.background.primary}80`,
        borderBottom: `1px solid ${colors.background.secondary}`
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[100px] transition-all duration-500 ease-in-out">
            {logo_url && (
              <img 
                src={logo_url} 
                alt={name} 
                className="h-8 w-auto object-contain transition-all duration-500 ease-in-out"
              />
            )}
          </div>

          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.font.secondary }} />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 transition-all duration-500 ease-in-out"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ 
                  backgroundColor: `${colors.background.secondary}80`,
                  color: colors.font.primary,
                  borderColor: colors.background.secondary
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  style={{ color: colors.font.primary }}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSortChange('newest')}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('oldest')}>
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('price-asc')}>
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('price-desc')}>
                  Price: High to Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  style={{ color: colors.font.primary }}
                >
                  {selectedCategory || 'All Categories'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onCategoryChange(null)}>
                  All Categories
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onClick={() => onCategoryChange(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onGridChange('small')}
              className={gridSize === 'small' ? 'bg-primary/10' : ''}
            >
              <Grid3X3 className="h-4 w-4" style={{ color: colors.font.primary }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onGridChange('medium')}
              className={gridSize === 'medium' ? 'bg-primary/10' : ''}
            >
              <Grid2X2 className="h-4 w-4" style={{ color: colors.font.primary }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onGridChange('large')}
              className={gridSize === 'large' ? 'bg-primary/10' : ''}
            >
              <LayoutGrid className="h-4 w-4" style={{ color: colors.font.primary }} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}