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
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange?: (category: string | null) => void;
  currentSort?: string;
  onSortChange?: (sort: string) => void;
  mainColor?: string;
}

export function HeaderDropdown({
  categories,
  selectedCategory,
  onCategoryChange,
  currentSort,
  onSortChange,
  mainColor,
}: HeaderDropdownProps) {
  console.log("HeaderDropdown - currentSort:", currentSort);

  const handleSortChange = (sort: string) => {
    console.log("Changing sort to:", sort);
    onSortChange?.(sort);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          style={{ 
            backgroundColor: `${mainColor}10`,
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
        {categories.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Categories</DropdownMenuLabel>
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategory === category}
                onCheckedChange={() => onCategoryChange?.(category === selectedCategory ? null : category)}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

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