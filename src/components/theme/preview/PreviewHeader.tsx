import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewOptionsDropdown } from "./ViewOptionsDropdown"

interface PreviewHeaderProps {
  logo_url?: string
  name: string
  mainColor: string
  onSearchChange: (query: string) => void
  onSortChange?: (sort: string) => void
  onCategoryChange?: (category: string | null) => void
  searchQuery: string
  categories?: string[]
  selectedCategory?: string | null
  currentSort?: string
  isScrolled: boolean
  onLogoClick?: () => void
  layout: string
  textPlacement: string
  onLayoutChange: (layout: string) => void
  onTextPlacementChange: (placement: string) => void
}

export function PreviewHeader({
  logo_url,
  name,
  mainColor,
  onSearchChange,
  onSortChange,
  onCategoryChange,
  searchQuery,
  categories = [],
  selectedCategory,
  currentSort,
  isScrolled,
  onLogoClick,
  layout,
  textPlacement,
  onLayoutChange,
  onTextPlacementChange,
}: PreviewHeaderProps) {
  return (
    <header 
      className={`w-full transition-all duration-300 ${
        isScrolled 
          ? 'fixed top-0 left-0 z-50 right-0 bg-white/80 backdrop-blur-sm shadow-sm transform translate-y-0' 
          : 'relative bg-transparent transform -translate-y-full pointer-events-none opacity-0'
      }`}
    >
      <div className="w-full py-4 px-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            {logo_url && (
              <img 
                src={logo_url} 
                alt={name}
                className="h-8 object-contain cursor-pointer"
                onClick={onLogoClick}
              />
            )}
          </div>

          <div className="flex items-center gap-4 flex-grow justify-end">
            {categories.length > 0 && (
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => onCategoryChange?.(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[160px] bg-white/80">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select
              value={currentSort}
              onValueChange={(value) => onSortChange?.(value)}
            >
              <SelectTrigger className="w-[160px] bg-white/80">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white/80"
              />
            </div>

            <ViewOptionsDropdown
              layout={layout}
              textPlacement={textPlacement}
              mainColor={mainColor}
              onLayoutChange={onLayoutChange}
              onTextPlacementChange={onTextPlacementChange}
            />
          </div>
        </div>
      </div>
    </header>
  )
}