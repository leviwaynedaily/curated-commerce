import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderDropdownProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange?: (category: string | null) => void;
  currentSort?: string;
  onSortChange?: (sort: string) => void;
  layout?: string;
  onLayoutChange?: (layout: string) => void;
  textPlacement?: string;
  onTextPlacementChange?: (placement: string) => void;
  mainColor?: string;
}

export function HeaderDropdown({
  categories,
  selectedCategory,
  onCategoryChange,
  currentSort,
  onSortChange,
  layout,
  onLayoutChange,
  textPlacement,
  onTextPlacementChange,
  mainColor,
}: HeaderDropdownProps) {
  return (
    <TooltipProvider>
      <DropdownMenu modal={false}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="bg-white/80 hover:bg-white/90 h-9 w-9"
              >
                <Settings2 className="h-4 w-4" style={{ color: mainColor }} />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Options</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent 
          className="w-56 bg-white/95 backdrop-blur-sm" 
          onCloseAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            const target = e.target as Node;
            const currentTarget = e.currentTarget as HTMLElement;
            if (!currentTarget.contains(target)) {
              currentTarget.dispatchEvent(new Event('close', { bubbles: true }));
            }
          }}
        >
          {categories.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Category</DropdownMenuLabel>
              <DropdownMenuRadioGroup 
                value={selectedCategory || "all"} 
                onValueChange={(value) => {
                  onCategoryChange?.(value === "all" ? null : value);
                  // Prevent closing on selection
                  setTimeout(() => {
                    const trigger = document.querySelector('[role="menuitem"][data-state="on"]');
                    if (trigger) {
                      (trigger as HTMLElement).focus();
                    }
                  }, 0);
                }}
              >
                <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                {categories.map((category) => (
                  <DropdownMenuRadioItem key={category} value={category}>
                    {category}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Sort By</DropdownMenuLabel>
          <DropdownMenuRadioGroup 
            value={currentSort} 
            onValueChange={(value) => {
              onSortChange?.(value);
              // Prevent closing on selection
              setTimeout(() => {
                const trigger = document.querySelector('[role="menuitem"][data-state="on"]');
                if (trigger) {
                  (trigger as HTMLElement).focus();
                }
              }, 0);
            }}
          >
            <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="price-asc">Price: Low to High</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="price-desc">Price: High to Low</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">View</DropdownMenuLabel>
          <DropdownMenuRadioGroup 
            value={layout} 
            onValueChange={(value) => {
              onLayoutChange?.(value);
              // Prevent closing on selection
              setTimeout(() => {
                const trigger = document.querySelector('[role="menuitem"][data-state="on"]');
                if (trigger) {
                  (trigger as HTMLElement).focus();
                }
              }, 0);
            }}
          >
            <DropdownMenuRadioItem value="list">List View</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="small">Small Grid</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="medium">Medium Grid</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="large">Large Grid</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Text Placement</DropdownMenuLabel>
          <DropdownMenuRadioGroup 
            value={textPlacement} 
            onValueChange={(value) => {
              onTextPlacementChange?.(value);
              // Prevent closing on selection
              setTimeout(() => {
                const trigger = document.querySelector('[role="menuitem"][data-state="on"]');
                if (trigger) {
                  (trigger as HTMLElement).focus();
                }
              }, 0);
            }}
          >
            <DropdownMenuRadioItem value="overlay">Text Overlay</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="below">Text Below</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}