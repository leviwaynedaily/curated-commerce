import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
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
    <div className="grid grid-cols-3 gap-2 w-full">
      {/* Categories Filter */}
      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) => onCategoryChange?.(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-full h-10 text-sm bg-white/80 backdrop-blur-sm">
          Filter
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Items</SelectItem>
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
        <SelectTrigger className="w-full h-10 text-sm bg-white/80 backdrop-blur-sm">
          Sort
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="price-asc">Price ↑</SelectItem>
          <SelectItem value="price-desc">Price ↓</SelectItem>
        </SelectContent>
      </Select>

      {/* View Options */}
      <ViewOptionsDropdown
        layout={layout}
        textPlacement={textPlacement}
        mainColor={previewData.main_color || "#000000"}
        onLayoutChange={onLayoutChange}
        onTextPlacementChange={onTextPlacementChange}
        className="w-full h-10 text-sm bg-white/80 backdrop-blur-sm"
      />
    </div>
  )
}