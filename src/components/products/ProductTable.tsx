import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ProductActions } from "./ProductActions"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductForm } from "../forms/ProductForm"

interface ProductTableProps {
  storefrontId: string
  statusFilter: string
  searchQuery: string
  selectedProducts: string[]
  onSelectedProductsChange: (products: string[]) => void
}

interface EditableCell {
  productId: string
  field: string
}

export function ProductTable({
  storefrontId,
  statusFilter,
  searchQuery,
  selectedProducts,
  onSelectedProductsChange,
}: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null)
  const queryClient = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", storefrontId, statusFilter, searchQuery],
    queryFn: async () => {
      console.log("Fetching products for storefront:", storefrontId)
      let query = supabase
        .from("products")
        .select("*")
        .eq("storefront_id", storefrontId)
        .order("created_at", { ascending: false })

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching products:", error)
        throw error
      }

      console.log("Products fetched:", data)
      return data
    },
  })

  const toggleProductSelection = (productId: string) => {
    onSelectedProductsChange(
      selectedProducts.includes(productId)
        ? selectedProducts.filter(id => id !== productId)
        : [...selectedProducts, productId]
    )
  }

  const toggleAllProducts = () => {
    if (products) {
      onSelectedProductsChange(
        selectedProducts.length === products.length
          ? []
          : products.map(product => product.id)
      )
    }
  }

  const handleCellClick = (productId: string, field: string) => {
    if (field === "status" || field === "images") return // Don't make these fields inline editable
    setEditingCell({ productId, field })
  }

  const handleCellUpdate = async (productId: string, field: string, value: string) => {
    try {
      const numericFields = ["in_town_price", "shipping_price"]
      const updateValue = numericFields.includes(field) ? Number(value) : value

      const { error } = await supabase
        .from("products")
        .update({ [field]: updateValue })
        .eq("id", productId)

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product updated successfully!")
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product")
    } finally {
      setEditingCell(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, productId: string, field: string, value: string) => {
    if (e.key === "Enter") {
      handleCellUpdate(productId, field, value)
    } else if (e.key === "Escape") {
      setEditingCell(null)
    }
  }

  if (isLoading) {
    return <div>Loading products...</div>
  }

  if (!products?.length) {
    return <div>No products found. Create your first product above!</div>
  }

  const renderCell = (product: any, field: string) => {
    const isEditing = editingCell?.productId === product.id && editingCell?.field === field

    if (isEditing) {
      return (
        <Input
          autoFocus
          defaultValue={product[field]}
          onBlur={(e) => handleCellUpdate(product.id, field, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, product.id, field, e.currentTarget.value)}
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
      default:
        return product[field]
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={products.length > 0 && selectedProducts.length === products.length}
                  onCheckedChange={toggleAllProducts}
                />
              </TableHead>
              <TableHead className="min-w-[300px]">Product</TableHead>
              <TableHead className="min-w-[200px]">Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>In-Town Price</TableHead>
              <TableHead>Shipping Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                  />
                </TableCell>
                <TableCell onClick={() => handleCellClick(product.id, "name")}>
                  {renderCell(product, "name")}
                </TableCell>
                <TableCell onClick={() => handleCellClick(product.id, "description")}>
                  {renderCell(product, "description")}
                </TableCell>
                <TableCell>
                  <Badge variant={product.status === "active" ? "default" : "secondary"}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell onClick={() => handleCellClick(product.id, "in_town_price")}>
                  {renderCell(product, "in_town_price")}
                </TableCell>
                <TableCell onClick={() => handleCellClick(product.id, "shipping_price")}>
                  {renderCell(product, "shipping_price")}
                </TableCell>
                <TableCell onClick={() => handleCellClick(product.id, "category")}>
                  {renderCell(product, "category")}
                </TableCell>
                <TableCell className="text-right">
                  <ProductActions
                    productId={product.id}
                    onEdit={() => setEditingProduct(product)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              storefrontId={storefrontId}
              product={editingProduct}
              onSuccess={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}