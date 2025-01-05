import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentSort: string;
  onSortChange: (sort: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categories: string[];
  gridSize: 'small' | 'medium' | 'large';
  onGridChange: (size: 'small' | 'medium' | 'large') => void;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  currentSort,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  gridSize,
  onGridChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div className="relative flex-1 max-w-md w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Select
          value={currentSort}
          onValueChange={onSortChange}
        >
          <SelectTrigger className="w-[160px]">
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
            <SelectTrigger className="w-[160px]">
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