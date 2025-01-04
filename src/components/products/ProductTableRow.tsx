import { format } from "date-fns"
import { TableCell, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ProductActions } from "./ProductActions"

interface EditableCell {
  productId: string
  field: string
}

interface ProductTableRowProps {
  product: any
  isSelected: boolean
  onToggleSelect: (productId: string) => void
  editingCell: EditableCell | null
  onCellClick: (productId: string, field: string) => void
  onCellUpdate: (productId: string, field: string, value: string) => void
  onKeyDown: (e: React.KeyboardEvent, productId: string, field: string, value: string) => void
  onEdit: (product: any) => void
}

export function ProductTableRow({
  product,
  isSelected,
  onToggleSelect,
  editingCell,
  onCellClick,
  onCellUpdate,
  onKeyDown,
  onEdit,
}: ProductTableRowProps) {
  const renderCell = (field: string) => {
    const isEditing = editingCell?.productId === product.id && editingCell?.field === field

    if (isEditing) {
      return (
        <Input
          autoFocus
          defaultValue={product[field]}
          onBlur={(e) => onCellUpdate(product.id, field, e.target.value)}
          onKeyDown={(e) => onKeyDown(e, product.id, field, e.currentTarget.value)}
          className="w-full"
        />
      )
    }

    switch (field) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-10 w-10 rounded-md object-cover"
              />
            )}
            <span className="cursor-pointer hover:text-primary">{product[field]}</span>
          </div>
        )
      case "description":
        return (
          <span className="line-clamp-2 text-sm text-muted-foreground cursor-pointer hover:text-primary">
            {product[field] || "—"}
          </span>
        )
      case "in_town_price":
      case "shipping_price":
        return <span className="cursor-pointer hover:text-primary">${product[field]}</span>
      case "category":
        return (
          <span className="cursor-pointer hover:text-primary">
            {product[field] || "—"}
          </span>
        )
      case "created_at":
        return format(new Date(product.created_at), 'MMM d, yyyy')
      default:
        return product[field]
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(product.id)}
        />
      </TableCell>
      <TableCell onClick={() => onCellClick(product.id, "name")}>
        {renderCell("name")}
      </TableCell>
      <TableCell onClick={() => onCellClick(product.id, "description")}>
        {renderCell("description")}
      </TableCell>
      <TableCell>
        <Badge variant={product.status === "active" ? "default" : "secondary"}>
          {product.status}
        </Badge>
      </TableCell>
      <TableCell onClick={() => onCellClick(product.id, "in_town_price")}>
        {renderCell("in_town_price")}
      </TableCell>
      <TableCell onClick={() => onCellClick(product.id, "shipping_price")}>
        {renderCell("shipping_price")}
      </TableCell>
      <TableCell onClick={() => onCellClick(product.id, "category")}>
        {renderCell("category")}
      </TableCell>
      <TableCell>
        {renderCell("created_at")}
      </TableCell>
      <TableCell className="text-right">
        <ProductActions
          productId={product.id}
          onEdit={() => onEdit(product)}
        />
      </TableCell>
    </TableRow>
  )
}