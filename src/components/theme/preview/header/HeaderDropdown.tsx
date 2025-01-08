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
          className="hover:bg-opacity-20 h-11 w-11" // Increased from h-9 w-9 to h-11 w-11
        >
          <SlidersHorizontal className="h-6 w-6" /> {/* Increased icon size */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48"> {/* Increased width */}
        <DropdownMenuItem
          className="text-base py-3" // Increased text size and padding
          onClick={() => onSortChange?.("newest")}
        >
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-base py-3" // Increased text size and padding
          onClick={() => onSortChange?.("oldest")}
        >
          Oldest First
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-base py-3" // Increased text size and padding
          onClick={() => onSortChange?.("price-asc")}
        >
          Price: Low to High
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-base py-3" // Increased text size and padding
          onClick={() => onSortChange?.("price-desc")}
        >
          Price: High to Low
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}