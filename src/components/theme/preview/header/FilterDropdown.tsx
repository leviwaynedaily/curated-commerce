import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

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
          className="hover:bg-opacity-20 h-11 w-11"
        >
          <Filter className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-lg"
      >
        <DropdownMenuItem
          className="text-base py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => onCategoryChange?.(null)}
        >
          All Categories
        </DropdownMenuItem>
        {categories.map((category) => (
          <DropdownMenuItem
            key={category}
            className="text-base py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => onCategoryChange?.(category)}
          >
            {category}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}