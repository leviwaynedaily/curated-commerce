import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ProductStatus = "active" | "inactive" | "all";

interface ProductFiltersProps {
  selectedStatus: ProductStatus
  onStatusChange: (status: ProductStatus) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ProductFilters({
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-4">
      <Tabs value={selectedStatus} onValueChange={onStatusChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter products"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">More filters</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>By category</DropdownMenuItem>
            <DropdownMenuItem>By price range</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}