import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, CircleDot } from "lucide-react";

interface FilterDropdownProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: ((category: string | null) => void) | undefined;
  mainColor: string;
}

export function FilterDropdown({
  categories,
  selectedCategory,
  onCategoryChange,
  mainColor,
}: FilterDropdownProps) {
  if (!categories.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          style={{ 
            backgroundColor: `${mainColor}10`,
            color: mainColor
          }}
          className="hover:bg-opacity-20 h-11 w-11 relative"
        >
          <Filter className="h-6 w-6" />
          {selectedCategory && (
            <div 
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: mainColor }}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-lg"
      >
        <DropdownMenuItem
          className="text-base py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
          onClick={() => onCategoryChange?.(null)}
        >
          <span>All Categories</span>
          {selectedCategory === null && (
            <CircleDot className="h-4 w-4 ml-2" style={{ color: mainColor }} />
          )}
        </DropdownMenuItem>
        {categories.map((category) => (
          <DropdownMenuItem
            key={category}
            className="text-base py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
            onClick={() => onCategoryChange?.(category)}
          >
            <span>{category}</span>
            {selectedCategory === category && (
              <CircleDot className="h-4 w-4 ml-2" style={{ color: mainColor }} />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}