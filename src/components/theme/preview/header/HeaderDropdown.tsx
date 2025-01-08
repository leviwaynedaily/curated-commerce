import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, CircleDot } from "lucide-react";

interface HeaderDropdownProps {
  currentSort?: string;
  onSortChange?: (sort: string) => void;
  mainColor: string;
}

export function HeaderDropdown({ currentSort = "newest", onSortChange, mainColor }: HeaderDropdownProps) {
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

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
          <SlidersHorizontal className="h-6 w-6" />
          {currentSort !== "newest" && (
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
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="text-base py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
            onClick={() => onSortChange?.(option.value)}
          >
            <span>{option.label}</span>
            {currentSort === option.value && (
              <CircleDot className="h-4 w-4 ml-2" style={{ color: mainColor }} />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}