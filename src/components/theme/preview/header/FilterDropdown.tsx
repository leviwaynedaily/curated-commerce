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
          className="hover:bg-opacity-20 h-11 w-11" // Increased from h-9 w-9 to h-11 w-11
        >
          <Filter className="h-6 w-6" /> {/* Increased icon size */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48"> {/* Increased width */}
        <DropdownMenuItem
          className="text-base py-3" // Increased text size and padding
          onClick={() => onCategoryChange?.(null)}
        >
          All Categories
        </DropdownMenuItem>
        {categories.map((category) => (
          <DropdownMenuItem
            key={category}
            className="text-base py-3" // Increased text size and padding
            onClick={() => onCategoryChange?.(category)}
          >
            {category}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}