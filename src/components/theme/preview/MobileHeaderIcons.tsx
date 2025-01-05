import { Filter, ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ViewOptionsDropdown } from "./ViewOptionsDropdown"
import { PreviewData } from "@/types/preview"

interface MobileHeaderIconsProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  currentSort?: string
  onSortChange?: (sort: string) => void
  layout?: string
  textPlacement?: string
  onLayoutChange?: (layout: string) => void
  onTextPlacementChange?: (placement: string) => void
  previewData: PreviewData
}

export function MobileHeaderIcons({
  categories,
  selectedCategory,
  onCategoryChange,
  currentSort,
  onSortChange,
  layout = "medium",
  textPlacement = "below",
  onLayoutChange = () => {},
  onTextPlacementChange = () => {},
  previewData,
}: MobileHeaderIconsProps) {
  return (
    <div className="flex justify-between items-center px-2">
      <TooltipProvider>
        {/* Categories Filter */}
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => onCategoryChange?.(value === "all" ? null : value)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="w-12 h-12 p-0 border-none bg-transparent hover:bg-accent/20 rounded-full flex items-center justify-center">
                <Filter className="h-6 w-6" />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Categories</p>
            </TooltipContent>
          </Tooltip>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Button */}
        <Select
          value={currentSort}
          onValueChange={(value) => onSortChange?.(value)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="w-12 h-12 p-0 border-none bg-transparent hover:bg-accent/20 rounded-full flex items-center justify-center">
                <ArrowUpDown className="h-6 w-6" />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sort</p>
            </TooltipContent>
          </Tooltip>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        {/* View Options */}
        <ViewOptionsDropdown
          layout={layout}
          textPlacement={textPlacement}
          mainColor={previewData.main_color || "#000000"}
          onLayoutChange={onLayoutChange}
          onTextPlacementChange={onTextPlacementChange}
        />
      </TooltipProvider>
    </div>
  )
}