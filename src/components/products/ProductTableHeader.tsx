import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { TableHead } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SortConfig {
  field: string
  direction: 'asc' | 'desc' | null
}

interface ProductTableHeaderProps {
  field: string
  label: string
  sortable?: boolean
  className?: string
  currentSort: SortConfig
  onSort: (field: string) => void
}

export function ProductTableHeader({
  field,
  label,
  sortable = true,
  className,
  currentSort,
  onSort,
}: ProductTableHeaderProps) {
  const isSorted = currentSort.field === field
  
  return (
    <TableHead className={className}>
      {sortable ? (
        <Button
          variant="ghost"
          onClick={() => onSort(field)}
          className={cn(
            "-ml-4 h-8 data-[state=open]:bg-accent flex items-center gap-1",
            className
          )}
        >
          {label}
          {isSorted ? (
            currentSort.direction === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUp className="ml-2 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ) : (
        label
      )}
    </TableHead>
  )
}