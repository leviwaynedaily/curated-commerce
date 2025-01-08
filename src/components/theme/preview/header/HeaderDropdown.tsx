import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";

interface HeaderDropdownProps {
  currentSort?: string;
  onSortChange?: (sort: string) => void;
  mainColor: string;
}

export function HeaderDropdown({ currentSort, onSortChange, mainColor }: HeaderDropdownProps) {
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
          <SlidersHorizontal className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-lg"
      >
        <DropdownMenuItem
          className="text-base py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => onSortChange?.("newest")}
        >
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-base py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => onSortChange?.("oldest")}
        >
          Oldest First
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-base py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => onSortChange?.("price-asc")}
        >
          Price: Low to High
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-base py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => onSortChange?.("price-desc")}
        >
          Price: High to Low
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}