import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

interface HeaderDropdownProps {
  currentSort?: string;
  onSortChange?: (sort: string) => void;
  mainColor?: string;
}

export function HeaderDropdown({
  currentSort,
  onSortChange,
  mainColor,
}: HeaderDropdownProps) {
  console.log("HeaderDropdown - currentSort:", currentSort);

  const handleSortChange = (sort: string) => {
    console.log("Changing sort to:", sort);
    onSortChange?.(sort);
  };

  const isActive = currentSort && currentSort !== "newest";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          style={{ 
            backgroundColor: isActive ? `${mainColor}20` : `${mainColor}10`,
            color: mainColor
          }}
          className="hover:bg-opacity-20 h-9 w-9"
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-white/95 backdrop-blur-sm" 
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Sort By</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={currentSort === "newest"}
          onCheckedChange={() => handleSortChange("newest")}
        >
          Newest First
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={currentSort === "oldest"}
          onCheckedChange={() => handleSortChange("oldest")}
        >
          Oldest First
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={currentSort === "price-desc"}
          onCheckedChange={() => handleSortChange("price-desc")}
        >
          Price: High to Low
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={currentSort === "price-asc"}
          onCheckedChange={() => handleSortChange("price-asc")}
        >
          Price: Low to High
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}